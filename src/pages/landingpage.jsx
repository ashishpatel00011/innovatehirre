import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel,CarouselContent,CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import faqs from "../data/faq.json";
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger,} from "@/components/ui/accordion";
import companies from '../data/companies.json'
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 py-5 sm:gap-20 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center py-4 text-4xl font-extrabold tracking-tighter gradient-title sm:text-6xl lg:text-8xl">
          Find Your Dream Job
          <span className="flex items-center gap-2 sm:gap-6">
            with
            <img
              src="/logo.png"
              className="h-14 sm:h-24 lg:h-32"
              alt="innovatehire Logo"
            />
          </span>
        </h1>
        <p className="text-xs text-gray-300 sm:mt-4 sm:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex justify-center gap-6">
        <Link to={"/jobs"}>
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>
      <Carousel 
       plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full py-10">
        <CarouselContent className="flex items-center gap-5 sm:gap-20">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="object-contain h-9 sm:h-14"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <img src="./innovateh.webp" className="w-full" />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>
      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage
