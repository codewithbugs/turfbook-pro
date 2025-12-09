import { useState, useMemo } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TurfFormModal } from '@/components/admin/TurfFormModal';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { store, useStore } from '@/lib/store';
import { Turf } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Clock,
  IndianRupee,
  Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTurfs = () => {
  const { turfs } = useStore();
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTurf, setEditingTurf] = useState<Turf | null>(null);
  const [deletingTurf, setDeletingTurf] = useState<Turf | null>(null);

  const filteredTurfs = useMemo(() => {
    return turfs.filter((turf) => {
      const matchesSearch = turf.name.toLowerCase().includes(search.toLowerCase()) ||
                           turf.address.toLowerCase().includes(search.toLowerCase());
      const matchesCity = !cityFilter || turf.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [turfs, search, cityFilter]);

  const cities = [...new Set(turfs.map((t) => t.city))];

  const handleSave = (turfData: Omit<Turf, 'id'> | Turf) => {
    if ('id' in turfData) {
      store.updateTurf(turfData.id, turfData);
      toast({
        title: 'Turf Updated',
        description: `${turfData.name} has been updated successfully.`,
      });
    } else {
      store.addTurf(turfData);
      toast({
        title: 'Turf Added',
        description: `${turfData.name} has been added successfully.`,
      });
    }
    setEditingTurf(null);
  };

  const handleDelete = () => {
    if (deletingTurf) {
      store.deleteTurf(deletingTurf.id);
      toast({
        title: 'Turf Deleted',
        description: `${deletingTurf.name} has been deleted.`,
      });
      setDeletingTurf(null);
    }
  };

  const handleEdit = (turf: Turf) => {
    setEditingTurf(turf);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingTurf(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Manage Turfs" 
        subtitle={`${turfs.length} turfs registered`}
      />
      
      <main className="p-6">
        {/* Actions Bar */}
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
          
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-secondary border border-border text-foreground"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <Button variant="hero" onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Turf
          </Button>
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
                  {/* Image placeholder */}
                  <div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-lg text-foreground truncate">
                        {turf.name}
                      </h3>
                      {turf.featured && <Badge variant="accent">Featured</Badge>}
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{turf.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          <span>₹{turf.pricePerHour}/hr</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span>{turf.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{turf.openTime} - {turf.closeTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {turf.sports.map((sport) => (
                        <Badge key={sport} variant="sport" className="capitalize text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/turf/${turf.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleEdit(turf)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
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
            <p className="text-muted-foreground mb-4">
              {search || cityFilter ? 'Try adjusting your filters' : 'Add your first turf to get started'}
            </p>
            {!search && !cityFilter && (
              <Button variant="hero" onClick={handleAddNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Turf
              </Button>
            )}
          </div>
        )}
      </main>
      
      {/* Modals */}
      <TurfFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTurf(null);
        }}
        onSave={handleSave}
        turf={editingTurf}
      />
      
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
