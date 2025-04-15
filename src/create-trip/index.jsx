import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useTour } from "@reactour/tour";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const tripApi = {
  createTrip: (tripData) => api.post('/trips', tripData),
  getTrip: (id) => api.get(`/trips/${id}`),
  getUserTrips: (email, token) => api.get(`/trips/user/${email}`),
  updateTrip: (id, updates, token) => api.put(`/trips/${id}`, updates,),
  deleteTrip: (id, token) => api.delete(`/trips/${id}`, ),
};


function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const navigate = useNavigate();

  const { setIsOpen } = useTour();
  const [showTourPopup, setShowTourPopup] = useState(false);

  const [custom, setCustomTirp] = useState(false);


  // Show the tour popup on page mount
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTourPopup(true);
    }
  }, []);

  const handleStartTour = () => {
    setIsOpen(true);
    setShowTourPopup(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const handleDoItLater = () => {
    setShowTourPopup(false);
    localStorage.setItem('hasSeenTour', 'true');
  };


  // Load Google Places API script dynamically
  useEffect(() => {
    const loadGooglePlacesScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGooglePlacesScript();
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDailog(true);
      return;
    }

    if (
      formData?.noOfDays > 5 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all details!");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const parseAIResponse = (rawData) => {
    try {
      // Attempt direct JSON parse
      return JSON.parse(rawData);
    } catch (error) {
      // Fallback: Handle malformed JSON structure
      const fixedData = rawData
        // Fix missing "plan" property for day 3
        .replace(/"day": 3, {/g, '"day": 3, "plan": {')
        // Fix trailing commas
        .replace(/,\s*]/g, ']')
        .replace(/,\s*}/g, '}');

      return JSON.parse(fixedData);
    }
  };



  // Helper function to handle images
  const processImages = (tripData) => {
    const processImage = (url) => {
      if (url.startsWith('data:image')) return url; // Already base64
      // Add logic to convert external URLs to base64 if needed
      return url;
    };

    return {
      ...tripData,
      hotelOptions: tripData.hotelOptions?.map(hotel => ({
        ...hotel,
        hotelImageUrl: processImage(hotel.hotelImageUrl)
      })),
      itinerary: tripData.itinerary?.map(day => ({
        ...day,
        plan: day.plan?.map(place => ({
          ...place,
          placeImageUrl: processImage(place.placeImageUrl)
        }))
      }))
    };
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Use custom parser
      const parsedTripData = parseAIResponse(TripData);

      // Process images - convert to base64 if needed
      const processedData = processImages(parsedTripData);

      const response = await tripApi.createTrip({
        userSelections: formData,
        tripData: processedData,
        userEmail: user?.email
      });

      navigate(`/view-trip/${response.data._id}`);
    } catch (error) {
      toast.error("Failed to save trip");
      console.error("Save trip error:", error);
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDailog(false);
        OnGenerateTrip();
      });
  };

  const handleCustomTrip = () => {
    console.log("Custom Route")
    setCustomTirp(true);
    navigate('/custom-trip');
  };

  return (

    <div className="px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-10">
      <h2 className="text-3xl font-bold">
        Tell us your travel preferences 🌄🏔🌴
      </h2>

      <p className="mt-3 text-xl text-gray-500">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="flex flex-col gap-10 mt-20">
        <div className="first-step">
          <h2 className="my-3 text-xl font-medium">
            What is destination of Choice?
          </h2>
          {scriptLoaded ? (
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
              }}
            />
          ) : (
            <p>Loading Google Places...</p>
          )}
        </div>

        <div className="second-step">
          <h2 className="my-3 text-xl font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Example: 2"}
            type="number"
            min="1"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div className="third-step">
        <label className="my-3 text-xl font-medium">What is your Budget?</label>
        <p>
          The budget is exclusively allocated for activities and dining purposes.
        </p>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-2xl ${formData?.budget === item.title && "shadow-lg border-black"
                }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="fourth-step">
        <h2 className="my-3 text-xl font-medium">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-2xl ${formData?.traveler === item.people && "shadow-lg border-black"
                }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center my-10 ">
        <Button disabled={loading} onClick={OnGenerateTrip} className="mr-4 fifth-step">
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate AI Trip"
          )}
        </Button>
        <Button disabled={loading} onClick={handleCustomTrip}>Custom Trip</Button>
      </div>

      <Dialog open={showTourPopup} onOpenChange={setShowTourPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <h2 className="text-lg font-bold">Welcome to the Trip Planner!</h2>
              <p>Would you like a quick tour of how to use this page?</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleStartTour}>Start Tour</Button>
                <Button variant="outline" onClick={handleDoItLater}>
                  Do It Later
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="text-lg font-bold mt-7">Sign in With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="flex items-center w-full gap-4 mt-5"
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;