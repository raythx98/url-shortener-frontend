import { formatLink } from "@/helper/formatlink";
import {Copy, Download} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/context";
import {QRCode} from "react-qrcode-logo";
import { FaCheckCircle } from 'react-icons/fa'; 

export function CreateLink({ buttonText = "Create New Link" }) {
  const {user} = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const isLoggedIn = searchParams.get("isLoggedIn");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    fullUrl: longLink ? longLink : "",
    customUrl: "",
  });
  const [finalLink, setFinalLink] = useState("");

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    fullUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues, user_id: user?.id});

  useEffect(() => {
    if (error === null && data) {
      if (isLoggedIn == "true" || buttonText == "Create New Link") {
        navigate(`/link/${data.id}`);
      } else {
        setFinalLink(data.short_url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:5173/${data.short_url}`)
  };

  const downloadImage = () => {
    const imageUrl = data.qr;
    const fileName = data.title; // Desired file name for the downloaded image

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

  const createNewLink = async () => {
    setErrors([]);
    var proposedLink = formatLink(formValues.fullUrl);
    var oldLink = formValues.fullUrl
    const newErrors = {};
    if (formValues.fullUrl != proposedLink) {
      formValues.fullUrl = proposedLink;
      newErrors["fullUrl"] = `Invalid URL. Corrected from '${oldLink}' to '${proposedLink}'. Please try again.`;
    }
    try {
      await schema.validate(formValues, {abortEarly: false});

      if (newErrors["fullUrl"]) {
        throw new Error("Invalid URL");
      }

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
    }
    setErrors(newErrors);
  };

  const reset = async () => {
    setFinalLink(null);
    setFormValues({
      title: "",
      fullUrl: "",
      customUrl: "",
    });
  };

  return (
    <Dialog
      defaultOpen={isLoggedIn == 'true'}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.fullUrl && (
          <QRCode ref={ref} size={250} value={formValues?.fullUrl} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
          disabled={finalLink}
        />
        {errors.title && <Error message={errors.title} />}
        <Input
          id="fullUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.fullUrl}
          onChange={handleChange}
          disabled={finalLink}
        />
        {errors.fullUrl && <Error message={errors.fullUrl} />}
        <div className="flex items-center gap-2">
          {/* <Card className="p-2"></Card> / */}
          <Input
            placeholder="http://localhost:5173"
            value="http://localhost:5173"
            disabled={true}
          /> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
            disabled={finalLink}
          />
        </div>
        {error && <Error message={errors.message} />}
        {finalLink && (
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 ml-1 mr-3" size={40}/>
            {/* <Card className="flex-grow p-2 mr-2">
            http://localhost:5173/{finalLink}
            </Card> */}
            <Input
              className="flex-grow p-2 mr-2"
              placeholder={`http://localhost:5173/${finalLink}`}
              value={`http://localhost:5173/${finalLink}`}
              disabled={true}
            /> 
            <Button
              variant="ghost"
              onClick={handleCopyToClipboard}
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
          </div>
        )}
        { finalLink 
        ? (<DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={reset}
          >
            {"Reset"}
          </Button>
        </DialogFooter>)
        : (<DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>)}
        
      </DialogContent>
    </Dialog>
  );
}
