import { Season } from '@/lib/types/color';
import { seasonalProfiles } from '@/lib/constants/colors';

interface ResultsProps {
  season: Season;
  profile: typeof seasonalProfiles[Season];
  favorites: string[];
  recommendations?: {
    naturalSeason: Season;
    message: string;
  };
}

export default function Results({ 
  season, 
  profile, 
  favorites, 
  recommendations 
}: ResultsProps) {
  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-gray-800/50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Your {season.charAt(0).toUpperCase() + season.slice(1)} Color Profile
        </h2>
        <p className="text-gray-300">
          {profile.description}
        </p>
      </div>

      {recommendations && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Hair Color Recommendation
          </h3>
          <div className="space-y-4">
            <p className="text-gray-300">{recommendations.message}</p>
            <div className="p-4 bg-primary/10 rounded border border-primary/20">
              <p className="text-sm text-primary-light">
                💡 Tip: Your natural coloring often provides the most harmonious look. 
                Consider this recommendation when planning your next hair color change.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Your Seasonal Color Palette</h3>
        {/* ... rest of the color palette display ... */}
      </div>
    </div>
  );
} 