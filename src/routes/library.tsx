import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import TracksList from '../components/TracksList';
import View from '../elements/View';
import * as ViewMessage from '../elements/ViewMessage';
import useFilteredTracks from '../hooks/useFilteredTracks';
import usePlayingTrackID from '../hooks/usePlayingTrackID';
import config from '../lib/config';
import database from '../lib/database';
import queryClient from '../lib/query-client';
import useLibraryStore from '../stores/useLibraryStore';

const QUERY_ALL_TRACKS = 'all_tracks';

export const Route = createFileRoute('/library')({
  component: ViewLibrary,
  loader: async () => {
    queryClient.fetchQuery({
      queryKey: [QUERY_ALL_TRACKS],
      queryFn: database.getAllTracks,
    });

    return {
      playlists: await database.getAllPlaylists(),
      tracksDensity: await config.get('track_view_density'),
    };
  },
});

function ViewLibrary() {
  const trackPlayingID = usePlayingTrackID();
  const refreshing = useLibraryStore((state) => state.refreshing);
  const search = useLibraryStore((state) => state.search);
  const sortBy = useLibraryStore((state) => state.sortBy);
  const sortOrder = useLibraryStore((state) => state.sortOrder);

  const { playlists, tracksDensity } = Route.useLoaderData();

  // Some queries when switching routes can be expensive-ish (like getting all tracks),
  // while at the same time, the data will most of the time never change.
  // Using stale-while-revalidate libraries help us (fake-)loading this page faster
  const { data: tracks, isLoading } = useQuery({
    queryKey: [QUERY_ALL_TRACKS],
    queryFn: database.getAllTracks,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const filteredTracks = useFilteredTracks(tracks ?? [], sortBy, sortOrder);

  const getLibraryComponent = useMemo(() => {
    // Refreshing library
    if (isLoading) {
      return (
        <ViewMessage.Notice>
          <p>Loading library...</p>
        </ViewMessage.Notice>
      );
    }

    // Refreshing library
    if (refreshing) {
      return (
        <ViewMessage.Notice>
          <p>Your library is being scanned =)</p>
          <ViewMessage.Sub>hold on...</ViewMessage.Sub>
        </ViewMessage.Notice>
      );
    }

    // Empty library
    if (filteredTracks.length === 0 && search === '') {
      return (
        <ViewMessage.Notice>
          <p>There is no music in your library :(</p>
          <ViewMessage.Sub>
            <span>you can</span>{' '}
            <Link to="/settings/library" draggable={false}>
              add your music here
            </Link>
          </ViewMessage.Sub>
        </ViewMessage.Notice>
      );
    }

    // Empty search
    if (filteredTracks.length === 0) {
      return (
        <ViewMessage.Notice>
          <p>Your search returned no results</p>
        </ViewMessage.Notice>
      );
    }

    // All good !
    return (
      <TracksList
        type="library"
        tracks={filteredTracks}
        tracksDensity={tracksDensity}
        trackPlayingID={trackPlayingID}
        playlists={playlists}
      />
    );
  }, [
    search,
    refreshing,
    filteredTracks,
    playlists,
    trackPlayingID,
    tracksDensity,
    isLoading,
  ]);

  return <View>{getLibraryComponent}</View>;
}

// ViewLibrary.whyDidYouRender = true;
