import { useEffect, useState } from "react";
import API from "../services/api";

export default function useUserPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    API.get("/userplans").then((res) => setPlans(res.data));
  }, []);

  return plans;
}
