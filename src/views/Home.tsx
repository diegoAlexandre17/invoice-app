import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabase/client";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { signOut } = useAuth();

  return (
    <div>
      Home
      <Button variant="destructive" onClick={signOut}>
        Destructive
      </Button>
    </div>
  );
};

export default Home;
