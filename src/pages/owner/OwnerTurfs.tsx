import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore, store } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { TurfFormModal } from '@/components/admin/TurfFormModal';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { toast } from '@/hooks/use-toast';
import { Turf } from '@/lib/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Star,
  Clock,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const approvalBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Approved</Badge>;
    case 'pending':
      return <Badge variant="accent" className="gap-1"><Clock className="w-3 h-3" />Pending Approval</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
    case 'changes_requested':
      return <Badge variant="accent" className="gap-1"><MessageSquare className="w-3 h-3" />Changes Requested</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const OwnerTurfs = () => {
  const { turfs } = useStore();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTurf, setEditTurf] = useState<Turf | null>(null);
  const [deleteTurf, setDeleteTurf] = useState<Turf | null>(null);

  const myTurfs = useMemo(() => {
    const owned = store.getTurfsByOwner(user?.id || '');
    if (!searchQuery) return owned;
    const q = searchQuery.toLowerCase();
    return owned.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }, [turfs, user?.id, searchQuery]);

  const handleSave = (data: Partial<Turf>) => {
    if (editTurf) {
      // Re-submit for approval when editing
      store.updateTurf(editTurf.id, {
        ...data,
        approvalStatus: 'pending',
        adminComment: undefined,
      });
      toast({ title: 'Turf updated', description: 'Your turf has been re-submitted for admin approval.' });
      setEditTurf(null);
    } else {
      store.addTurf({
        ...data as any,
        ownerId: user?.id || '',
        approvalStatus: 'pending',
        rating: 0,
        reviewCount: 0,
        imageUrl: '/placeholder.svg',
      });
      toast({ title: 'Turf submitted', description: 'Your turf has been submitted for admin approval.' });
      setShowAddModal(false);
    }
  };

  const handleDelete = () => {
    if (deleteTurf) {
      store.deleteTurf(deleteTurf.id);
      toast({ title: 'Turf deleted', description: 'Your turf has been removed.' });
      setDeleteTurf(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Turfs</h1>
          <p className="text-muted-foreground">Manage your sports venues</p>
        </div>
        <Button variant="hero" className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add New Turf
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search your turfs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-secondary border-border"
        />
      </div>

      {/* Turf List */}
      {myTurfs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTurfs.map((turf) => (
            <Card key={turf.id} className="border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-lg text-foreground">
                        {turf.name}
                      </h3>
                    </div>
                    {approvalBadge(turf.approvalStatus)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTurf(turf)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTurf(turf)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Admin comment */}
                {turf.adminComment && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Admin Feedback</p>
                        <p className="text-sm text-muted-foreground">{turf.adminComment}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {turf.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {turf.openTime} - {turf.closeTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {turf.rating} ({turf.reviewCount} reviews)
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    {turf.sports.map((sport) => (
                      <Badge key={sport} variant="sport" className="capitalize">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <span className="font-display font-bold text-foreground">
                    ₹{turf.pricePerHour.toLocaleString()}/hr
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No turfs yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Add your first turf to start receiving bookings
          </p>
          <Button variant="hero" className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Your First Turf
          </Button>
        </div>
      )}

      {/* Modals */}
      <TurfFormModal
        open={showAddModal || !!editTurf}
        turf={editTurf || undefined}
        onClose={() => {
          setShowAddModal(false);
          setEditTurf(null);
        }}
        onSave={handleSave}
      />
      <ConfirmDeleteModal
        open={!!deleteTurf}
        onClose={() => setDeleteTurf(null)}
        onConfirm={handleDelete}
        title="Delete Turf"
        description={`Are you sure you want to delete "${deleteTurf?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default OwnerTurfs;
