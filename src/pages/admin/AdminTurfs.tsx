import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { store, useStore } from '@/lib/store';
import { Turf } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  IndianRupee,
  Trophy,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

const approvalBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Approved</Badge>;
    case 'pending':
      return <Badge variant="accent" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
    case 'changes_requested':
      return <Badge variant="accent" className="gap-1"><MessageSquare className="w-3 h-3" />Changes Requested</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const AdminTurfs = () => {
  const { turfs } = useStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState(searchParams.get('filter') || '');
  const [deletingTurf, setDeletingTurf] = useState<Turf | null>(null);
  const [reviewTurf, setReviewTurf] = useState<Turf | null>(null);
  const [adminComment, setAdminComment] = useState('');

  const filteredTurfs = useMemo(() => {
    const priority: Record<string, number> = {
      pending: 0,
      changes_requested: 1,
      rejected: 2,
      approved: 3,
    };

    return turfs
      .filter((turf) => {
        const matchesSearch =
          turf.name.toLowerCase().includes(search.toLowerCase()) ||
          turf.address.toLowerCase().includes(search.toLowerCase());
        const matchesApproval = !approvalFilter || turf.approvalStatus === approvalFilter;
        return matchesSearch && matchesApproval;
      })
      .sort((a, b) => {
        const byStatus = (priority[a.approvalStatus] ?? 99) - (priority[b.approvalStatus] ?? 99);
        if (byStatus !== 0) return byStatus;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [turfs, search, approvalFilter]);

  const approvalCounts = useMemo(() => ({
    all: turfs.length,
    pending: turfs.filter((t) => t.approvalStatus === 'pending').length,
    approved: turfs.filter((t) => t.approvalStatus === 'approved').length,
    rejected: turfs.filter((t) => t.approvalStatus === 'rejected').length,
    changes_requested: turfs.filter((t) => t.approvalStatus === 'changes_requested').length,
  }), [turfs]);

  const handleApprove = (turf: Turf) => {
    store.approveTurf(turf.id);
    toast({ title: 'Turf Approved', description: `${turf.name} is now live on the platform.` });
    setReviewTurf(null);
  };

  const handleReject = () => {
    if (reviewTurf && adminComment) {
      store.rejectTurf(reviewTurf.id, adminComment);
      toast({ title: 'Turf Rejected', description: `${reviewTurf.name} has been rejected.` });
      setReviewTurf(null);
      setAdminComment('');
    }
  };

  const handleRequestChanges = () => {
    if (reviewTurf && adminComment) {
      store.requestChanges(reviewTurf.id, adminComment);
      toast({ title: 'Changes Requested', description: `Feedback sent to the turf owner.` });
      setReviewTurf(null);
      setAdminComment('');
    }
  };

  const handleDelete = () => {
    if (deletingTurf) {
      store.deleteTurf(deletingTurf.id);
      toast({ title: 'Turf Deleted', description: `${deletingTurf.name} has been removed.` });
      setDeletingTurf(null);
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Manage Turfs"
        subtitle={`${turfs.length} turfs total · ${approvalCounts.pending} pending approval`}
      />

      <main className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search turfs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Approval Status Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { key: '', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'changes_requested', label: 'Changes Requested' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={approvalFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setApprovalFilter(tab.key)}
            >
              {tab.label} ({approvalCounts[tab.key as keyof typeof approvalCounts] || approvalCounts.all})
            </Button>
          ))}
        </div>

        {/* Turfs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTurfs.map((turf, index) => (
            <Card
              key={turf.id}
              className="border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-lg text-foreground truncate">
                        {turf.name}
                      </h3>
                      {approvalBadge(turf.approvalStatus)}
                    </div>

                    {turf.adminComment && (
                      <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Admin note:</span> {turf.adminComment}
                        </p>
                      </div>
                    )}

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{turf.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          ₹{turf.pricePerHour}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          {turf.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {turf.openTime} - {turf.closeTime}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Owner: {turf.ownerId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {turf.sports.map((sport) => (
                        <Badge key={sport} variant="sport" className="capitalize text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {turf.approvalStatus === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleApprove(turf)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              setReviewTurf(turf);
                              setAdminComment('');
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            Review
                          </Button>
                        </>
                      )}
                      <Link to={`/turf/${turf.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => setDeletingTurf(turf)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTurfs.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No turfs found
            </h3>
            <p className="text-muted-foreground">
              {search || approvalFilter ? 'Try adjusting your filters' : 'No turfs registered yet'}
            </p>
          </div>
        )}
      </main>

      {/* Review Dialog */}
      <Dialog open={!!reviewTurf} onOpenChange={() => setReviewTurf(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Review Turf: {reviewTurf?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Admin Comment / Feedback</Label>
              <Textarea
                placeholder="Provide feedback to the turf owner..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setReviewTurf(null)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleRequestChanges}
              disabled={!adminComment}
            >
              <MessageSquare className="w-4 h-4" />
              Request Changes
            </Button>
            <Button
              variant="destructive"
              className="gap-1"
              onClick={handleReject}
              disabled={!adminComment}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        open={!!deletingTurf}
        onClose={() => setDeletingTurf(null)}
        onConfirm={handleDelete}
        title="Delete Turf"
        description={`Are you sure you want to delete "${deletingTurf?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTurfs;
