import {redirect} from "@/api/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";
import Error from "../components/error";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, error, fn} = useFetch(redirect, id);

  useEffect(() => {
    fn();
  }, []);

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
      
    );
  }

  if (error) {
    return (
      <>
        {error && <Error message={error?.message} />}
      </>
    );
  }

  return null;
};

export default RedirectLink;
