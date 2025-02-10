import { formatLink } from "@/helper/formatlink";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${formatLink(longUrl)}`);
  };

  return (
    <div className="flex flex-col items-center" style={{ marginTop: '15vh' }}>
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll ever need! 👇
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          placeholder="Enter your Loooong URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button type="submit" className="h-full" variant="destructive">
          Shorten!
        </Button>
      </form>
      <Accordion type="multiple" collapsible="true" className="my-20 w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Is this URL Shortener free forever?
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-1">It is free, but not forever. </p>
            <p>We may introduce a donation page or premium plan for advanced features in the future. </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Must I create an account to shorten URLs?
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-1">No. You are able to shorten URLs as a guest. </p>
            <p>However, it is highly recommended to create an account for advanced features. </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <p>What are the benefits of logging in?</p>
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-1">You can manage your URLs in a personalized dashboard. </p>
            <p>You can also view analytics such as the number of redirects, 
              and geolocation/device data of the redirects for each of your shortened URLs. </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            Is it safe to use?
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-1">Rest assured, your passwords are stored securely using <a
                href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link underline"
              >
                OWASP recommendations
              </a>. </p>
            <p className="mb-1">Please keep a backup of your links.</p>
            <p>Please report any bugs or security vulnerabilities to me through <a 
              href="mailto:raythx98@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline nav-link">my email</a>.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
