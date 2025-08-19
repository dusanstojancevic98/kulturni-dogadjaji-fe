import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  getMyEventsStats,
  getMyStats,
  getOverview,
  getTopEvents,
  getTopInstitutions,
} from "@src/services/analytics.api";
import { UserRole } from "@src/store/auth/auth.state";
import { useAuth } from "@src/store/auth/auth.store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import type {
  AnalyticsOverview,
  MyEventStat,
  MyStats,
} from "@src/models/analytics.types";
import type { Event } from "@src/models/event.types";
import type { Institution } from "@src/models/institution.types";

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <CardContent>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { user } = useAuth();

  const isAdmin = !!user && user.role === UserRole.ADMIN;

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [topInst, setTopInst] = useState<Institution[]>([]);
  const [myStats, setMyStats] = useState<MyStats | null>(null);
  const [myEvents, setMyEvents] = useState<MyEventStat[]>([]);

  useEffect(() => {
    (async () => {
      const [o, te, ti] = await Promise.all([
        getOverview(),
        getTopEvents(),
        getTopInstitutions(),
      ]);
      setOverview(o);
      setTopEvents(te);
      setTopInst(ti);

      const [ms, me] = await Promise.all([getMyStats(), getMyEventsStats()]);
      setMyStats(ms);
      setMyEvents(me);
    })();
  }, [isAdmin]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>

      {isAdmin && (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Korisnici" value={overview?.users ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Događaji" value={overview?.events ?? 0} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="Rezervacije"
                value={overview?.reservations ?? 0}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard label="Omiljeni" value={overview?.favorites ?? 0} />
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={1}>
                    Top događaji (rezervacije)
                  </Typography>
                  {topEvents.length === 0 ? (
                    <Typography color="text.secondary">
                      Nema podataka.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {topEvents.map((e) => (
                        <Box
                          key={e.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{e.title}</Typography>
                          <Typography color="text.secondary">
                            {e._count?.reservations ?? 0} / {e.capacity}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={1}>
                    Top institucije (broj događaja)
                  </Typography>
                  {topInst.length === 0 ? (
                    <Typography color="text.secondary">
                      Nema podataka.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {topInst.map((i) => (
                        <Box
                          key={i.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{i.name}</Typography>
                          <Typography color="text.secondary">
                            {i._count?.events ?? 0}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Typography variant="h5" mt={3} mb={1}>
        Moje statistike
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Moji događaji" value={myStats?.events ?? 0} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Moje rezervacije (ukupno)"
            value={myStats?.reservations ?? 0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Moji omiljeni (ukupno)"
            value={myStats?.favorites ?? 0}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Moji događaji (TOP 10)
          </Typography>
          {myEvents.length === 0 ? (
            <Typography color="text.secondary">Nema podataka.</Typography>
          ) : (
            <Stack spacing={1}>
              {myEvents.map((e) => (
                <Box
                  key={e.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 1,
                  }}
                >
                  <Typography>{e.title}</Typography>
                  <Typography color="text.secondary">
                    {dayjs(e.dateTime).format("DD.MM.YYYY HH:mm")}
                  </Typography>
                  <Typography color="text.secondary">
                    Rez: {e._count.reservations} • Fav: {e._count.favorites}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
