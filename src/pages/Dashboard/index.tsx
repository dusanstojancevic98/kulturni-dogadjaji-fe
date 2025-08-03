import { useAuth } from "../../store/authStoreProxy";

export default function Dashboard() {
  const { accessToken, setAccessToken } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Token: {accessToken}</p>
      <button onClick={() => setAccessToken("dummy-token")}>Set Token</button>
    </div>
  );
}
