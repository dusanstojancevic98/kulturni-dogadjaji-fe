import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnack } from "@src/components/common/snackbar/SnachbarProvider";
import type { AdminUser } from "@src/models/user.types";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@src/services/adminUsers.api";
import {
  adminUsersController,
  useAdminUsers,
} from "@src/store/adminUsers/adminUsers.controller";
import { useAuth } from "@src/store/auth/auth.controller";
import { UserRole, UserRoleLabel } from "@src/store/auth/auth.state";
import { useEffect, useState } from "react";

export const AdminUsersPage = () => {
  const snack = useSnack();
  const { user: me } = useAuth();
  const { filters, items, total } = useAdminUsers();

  useEffect(() => {
    adminUsersController.load();
  }, [filters]);

  const [openEdit, setOpenEdit] = useState<AdminUser | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState<AdminUser | null>(null);

  const [form, setForm] = useState<Partial<AdminUser & { password?: string }>>(
    {}
  );

  const startCreate = () => {
    setForm({
      name: "",
      email: "",
      role: UserRole.VISITOR,
      isActive: true,
      password: "",
    });
    setOpenCreate(true);
  };
  const startEdit = (u: AdminUser) => {
    setForm(u);
    setOpenEdit(u);
  };
  const startDelete = (u: AdminUser) => setOpenDelete(u);

  const submitCreate = async () => {
    if (!form.name || !form.email || !form.password) return;
    await createUser({
      name: form.name,
      email: form.email,
      password: form.password!,
      role: form.role,
      isActive: form.isActive,
    });
    setOpenCreate(false);
    snack.success("Korisnik kreiran");
    adminUsersController.load();
  };

  const submitEdit = async () => {
    if (!openEdit) return;
    await updateUser(openEdit.id, {
      name: form.name,
      email: form.email,
      role: form.role,
      isActive: form.isActive,
    });
    setOpenEdit(null);
    snack.success("Korisnik izmenjen");
    adminUsersController.load();
  };

  const submitDelete = async () => {
    if (!openDelete) return;
    await deleteUser(openDelete.id);
    setOpenDelete(null);
    snack.success("Korisnik obrisan");
    adminUsersController.load();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Korisnici (ukupno: {total})</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={startCreate}
        >
          Novi korisnik
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <TextField
          size="small"
          label="Pretraga"
          value={filters.q}
          onChange={(e) =>
            adminUsersController.setFilters({ q: e.target.value })
          }
        />
        <TextField
          select
          size="small"
          label="Uloga"
          value={filters.role}
          onChange={(e) => {
            adminUsersController.setFilters({
              role: e.target.value as UserRole,
            });
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem>Sve</MenuItem>
          {Object.values(UserRole).map((r) => (
            <MenuItem key={r} value={r}>
              {UserRoleLabel[r]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ime</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Uloga</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Akcije</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Chip label={u.role} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={u.isActive ? "Aktivan" : "Neaktivan"}
                  color={u.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => startEdit(u)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => startDelete(u)}
                  disabled={u.id === me?.id}
                >
                  <Tooltip
                    title={
                      u.id === me?.id
                        ? "Ne možete obrisati sopstveni nalog"
                        : "Obriši"
                    }
                  >
                    <span>
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Novi korisnik</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Ime"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <TextField
              label="Lozinka"
              type="password"
              value={form.password ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <TextField
              select
              label="Uloga"
              value={form.role ?? "VISITOR"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: e.target.value as AdminUser["role"],
                }))
              }
            >
              {Object.values(UserRole).map((r) => (
                <MenuItem key={r} value={r}>
                  {UserRoleLabel[r]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={form.isActive ?? true ? "true" : "false"}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.value === "true" }))
              }
            >
              <MenuItem value="true">Aktivan</MenuItem>
              <MenuItem value="false">Neaktivan</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Otkaži</Button>
          <Button variant="contained" onClick={submitCreate}>
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!openEdit}
        onClose={() => setOpenEdit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Izmena korisnika</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Ime"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <TextField
              select
              label="Uloga"
              value={form.role ?? "VISITOR"}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: e.target.value as AdminUser["role"],
                }))
              }
            >
              {Object.values(UserRole).map((r) => (
                <MenuItem key={r} value={r}>
                  {UserRoleLabel[r]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={form.isActive ?? true ? "true" : "false"}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.value === "true" }))
              }
            >
              <MenuItem value="true">Aktivan</MenuItem>
              <MenuItem value="false">Neaktivan</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(null)}>Otkaži</Button>
          <Button variant="contained" onClick={submitEdit}>
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!openDelete} onClose={() => setOpenDelete(null)}>
        <DialogTitle>Obriši korisnika</DialogTitle>
        <DialogContent>
          Da li ste sigurni da želite da obrišete korisnika {openDelete?.email}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(null)}>Otkaži</Button>
          <Button color="error" variant="contained" onClick={submitDelete}>
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
