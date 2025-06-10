
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to homepage since we're using Homepage as our main landing page
  return <Navigate to="/" replace />;
};

export default Index;
