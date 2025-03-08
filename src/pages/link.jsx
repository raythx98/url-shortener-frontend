import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {deleteUrl, getUrl} from "@/api/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, QrCode, LinkIcon, Trash} from "lucide-react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import Error from "../components/error";


const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = data?.url?.qr;
    const fileName = data?.url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const {id} = useParams();
  const {
    loading,
    data,
    fn,
    error,
  } = useFetch(getUrl, {id});

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  let link = "";
  if (data?.url) {
    link = data?.url?.custom_url ? data?.url?.custom_url : data?.url.short_url;
  }

  return (
    <>
      {error && <Error message={error?.message} />}
      {(loading) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer break-all">
            {data?.url?.title}
          </span>
          <a
            href={`${window.location.origin}/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer break-all"
          >
            {window.location.origin}/{link}
          </a>
          <a
            href={data?.url?.full_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer break-all"
          >
            <LinkIcon className="p-1" />
            {data?.url?.full_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(data?.url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.origin}/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <QrCode />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disable={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={data?.url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {data?.total_clicks ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{data?.total_clicks}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location countries={data?.countries} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats devices={data?.devices} />
            </CardContent>
          ) : (
            <CardContent>
              {loading === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
