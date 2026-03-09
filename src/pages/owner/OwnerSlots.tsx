import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useStore, store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { generateTimeSlots } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
} from 'lucide-react';

const OwnerSlots = () => {
  const { turfs, blockedSlots } = useStore();
  const { user } = useAuth();
  const [selectedTurfId, setSelectedTurfId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const myTurfs = useMemo(() => store.getTurfsByOwner(user?.id || ''), [turfs, user?.id]);

  const selectedTurf = myTurfs.find((t) => t.id === selectedTurfId);

  const timeSlots = useMemo(() => {
    if (!selectedTurf || !selectedDate) return [];
    return generateTimeSlots(selectedDate, selectedTurf.pricePerHour);
  }, [selectedTurf, selectedDate]);

  const blockedForDate = useMemo(() => {
    if (!selectedTurfId || !selectedDate) return [];
    return store
      .getBlockedSlots(selectedTurfId)
      .filter((b) => b.date === selectedDate.toISOString().split('T')[0]);
  }, [blockedSlots, selectedTurfId, selectedDate]);

  const blockedSlotIds = useMemo(() => {
    return new Set(blockedForDate.flatMap((b) => b.slotIds));
  }, [blockedForDate]);

  const toggleSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((s) => s !== slotId) : [...prev, slotId]
    );
  };

  const handleBlock = () => {
    if (selectedSlots.length === 0) return;
    store.blockSlots(
      selectedTurfId,
      selectedDate.toISOString().split('T')[0],
      selectedSlots,
      blockReason || 'Manual booking / blocked by owner'
    );
    toast({
      title: 'Slots blocked',
      description: `${selectedSlots.length} slot(s) blocked for ${selectedDate.toLocaleDateString('en-IN')}.`,
    });
    setSelectedSlots([]);
    setBlockReason('');
    setShowBlockDialog(false);
  };

  const handleUnblock = (blockId: string) => {
    store.unblockSlots(blockId);
    toast({ title: 'Slots unblocked', description: 'The slots are now available for booking.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Slot Management</h1>
        <p className="text-muted-foreground">
          Block time slots for manual bookings or maintenance
        </p>
      </div>

      {/* Turf Selector */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Select Turf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myTurfs.map((turf) => (
              <button
                key={turf.id}
                onClick={() => {
                  setSelectedTurfId(turf.id);
                  setSelectedSlots([]);
                }}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  selectedTurfId === turf.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <p className="font-semibold text-foreground">{turf.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {turf.city}
                </div>
              </button>
            ))}
          </div>
          {myTurfs.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No turfs available. Add a turf first.
            </p>
          )}
        </CardContent>
      </Card>

      {selectedTurf && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setSelectedSlots([]);
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">
                Time Slots — {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </CardTitle>
              {selectedSlots.length > 0 && (
                <Button
                  variant="hero"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowBlockDialog(true)}
                >
                  <Lock className="w-4 h-4" />
                  Block {selectedSlots.length} Slot(s)
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
                {timeSlots.map((slot) => {
                  const isBlocked = blockedSlotIds.has(slot.id);
                  return (
                    <button
                      key={slot.id}
                      disabled={!slot.available && !isBlocked}
                      onClick={() => {
                        if (!isBlocked) toggleSlot(slot.id);
                      }}
                      className={cn(
                        'p-3 rounded-xl border text-center transition-all relative',
                        !slot.available && !isBlocked && 'opacity-40 cursor-not-allowed bg-secondary',
                        isBlocked && 'bg-destructive/10 border-destructive/30 cursor-default',
                        slot.available &&
                          !isBlocked &&
                          !selectedSlots.includes(slot.id) &&
                          'border-border hover:border-primary/50 cursor-pointer',
                        selectedSlots.includes(slot.id) &&
                          'border-primary bg-primary/10 ring-1 ring-primary'
                      )}
                    >
                      <p className="font-semibold text-sm text-foreground">{slot.time}</p>
                      {isBlocked ? (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Lock className="w-3 h-3 text-destructive" />
                          <span className="text-xs text-destructive">Blocked</span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {slot.available ? `₹${slot.price.toLocaleString()}` : 'Booked'}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Currently Blocked Slots */}
              {blockedForDate.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-3">Blocked Slots for This Date</h4>
                  <div className="space-y-2">
                    {blockedForDate.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {block.slotIds
                              .map((s) => {
                                const hour = parseInt(s.replace('slot-', ''));
                                return `${hour.toString().padStart(2, '0')}:00`;
                              })
                              .join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground">{block.reason}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleUnblock(block.id)}
                        >
                          <Unlock className="w-3 h-3" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-secondary border border-border" />
                  Available
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary/10 border border-primary" />
                  Selected
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-destructive/10 border border-destructive/30" />
                  Blocked
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-secondary opacity-40" />
                  Booked
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Block Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Block Slots</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Blocking <span className="font-semibold text-foreground">{selectedSlots.length} slot(s)</span> on{' '}
              <span className="font-semibold text-foreground">
                {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Input
                placeholder="e.g., Manual booking for walk-in customer, Maintenance"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleBlock}>
              Block Slots
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerSlots;
