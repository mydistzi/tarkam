import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Write } from "@/views/component";
import Api from "@/api";
import Swal from "sweetalert2";

function Contacts() {
    const [input, setInput] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    // Handle response
    const [responsed, setResponsed] = useState({});

    // Handle error validation
    const [errors, setErrors] = useState({});

    // useNavigate to redirect page
    const navigate = useNavigate();

    // Handling event
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setInput({
            ...input,
            [event.currentTarget.name]: event.currentTarget.value,
        });

    // Define method
    const writes = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setErrors({});

        // Send data with API
        await Api.post("/shoutout", input)
            .then((response) => {
                // Assign message response to state "response"
                setResponsed(response.data.success);

                console.log({ responsed });

                // Clear last input data
                setInput({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });

                // Navigate to home page
                navigate("/", { replace: true });

                Swal.fire({
                    icon: "success",
                    title: "Thank you for contacting us, we will respond to you soon",
                    showConfirmButton: false,
                    timer: 3000,
                });
            })
            .catch((error) => {
                setErrors(error.response.data.errors);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${errors}`,
                    footer: '<a href="#">Something went wrong!!</a>',
                    showConfirmButton: false,
                    timer: 3000,
                });
            });
};

  return (
      <div className="agilecontactdist" id="contactTarkam">
          <div className="container">
              <h3>Write to Us</h3>
              <Write
                  isSubmit={writes}
                  handleChange={handleChange}
                  valueName={input.name}
                  valueEmail={input.email}
                  valuePhone={input.phone}
                  valueMessage={input.message}>
              </Write>
          </div>
      </div>
  );
}

export default Contacts;
