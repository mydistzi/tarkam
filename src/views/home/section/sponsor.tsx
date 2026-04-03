import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Partners, Stats, Subscribe } from "./partials";
import Api from "@/api";
import Swal from "sweetalert2";

interface StatsData {
  title: string;
  slug: string;
  nickname: string;
  image_path: string;
}

interface SponsorProps {
    sponsors: {
        image?: string;
        logo?: string;
        image_url?: string;
        imageUrl?: string;
        alt?: string;
        alt_text?: string;
        altText?: string;
        name?: string;
        title?: string;
    }[];
}

function Sponsors({ sponsors }: SponsorProps) {

    const [stats, setStats] = useState<StatsData[]>([]);
    const [input, setInput] = useState({ email: "" });

    // Handle response
    const [responsed, setResponsed] = useState({});

    // useNavigate to redirect page
    const navigate = useNavigate();

    // Fetch mosts data on component mount
    useEffect(() => {
        const fetchMosts = async () => {
            try {
                const response = await Api.get("/mosts");
                if (response?.data?.data) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching mosts data:", error);
            }
        };

        fetchMosts();
    }, []);

    // Handling event
    const handleSubscribe = (event: React.ChangeEvent<HTMLInputElement>) =>
        setInput({
            ...input,
            [event.currentTarget.name]: event.currentTarget.value,
        });

    // Define method
    const subscribes = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted with email:", input.email);

        // Basic email validation
        if (!input.email || !input.email.includes('@')) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address",
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }

        // Send data with API
        await Api.post("/subscribe", input)
            .then((response) => {
                // Assign message response to state "response"
                setResponsed(response.data.success);

                console.log({ responsed });

                // Clear last input data
                setInput({ email: "" });

                // Navigate to home page
                navigate("/", { replace: true });

                Swal.fire({
                    icon: "success",
                    title: "Thank you subscribing to our newsletter, we will send you the latest news and updates.",
                    showConfirmButton: false,
                    timer: 3000,
                });
            })
            .catch((error) => {
                console.error("Subscription error:", error);
                const errorMessage = error.response?.data?.message || error.response?.data?.errors?.email || "Failed to subscribe. Please try again.";
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: errorMessage,
                    footer: '<a href="#">Something went wrong!!</a>',
                    showConfirmButton: false,
                    timer: 3000,
                });
            });
    };
    return (
        <div>
            <Stats mosts={stats} />
            <Partners sponsors={sponsors} />
            <Subscribe isSubscribe={subscribes} handleSubscribe={handleSubscribe} valueEmail={input.email} />
        </div>
    )
}

export default Sponsors;