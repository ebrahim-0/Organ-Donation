import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    if (
      form.current.user_name.value === "" ||
      form.current.user_email.value === "" ||
      form.current.message.value === ""
    ) {
      toast.error("Please Fill All Fields", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      emailjs
        .sendForm(
          "service_w6s38xj",
          "template_ttpyzh4",
          form.current,
          "M4OTMS6BNW3FCqMaE",
        )
        .then(
          (result) => {
            console.log(result.text);
            toast.success("Email Sent Successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
          },
          (error) => {
            console.log(error.text);
            toast.error(error.text, {
              position: toast.POSITION.TOP_RIGHT,
            });
          },
        );
    }
  };

  return (
    <section className={"max-w-md mx-auto -mt-16"}>
      <h1 className="text-center text-2xl font-bold m-4">Contact Us</h1>
      <p className={"text-center text-xl font-bold m-4"}>
        Get a question? we’d -- to hear from you. Send us a message and we’ll
        respond as soon as possible.
      </p>
      <form
        className="flex flex-col gap-5 justify-center border-2 border-blue-500 bg-white w-full p-4 rounded-lg shadow"
        ref={form}
        onSubmit={sendEmail}
      >
        <label className="flex flex-col gap-1">
          Name
          <input
            className="form-input mt-1 block w-full h-10 rounded-md border-2 border-blue-300 outline-none pl-2 pr-7"
            type="text"
            name="user_name"
          />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            className="form-input mt-1 block w-full h-10 rounded-md border-2 border-blue-300 outline-none pl-2 pr-7"
            name="user_email"
          />
        </label>
        <label className="flex flex-col gap-1">
          Message
          <textarea
            className="form-textarea mt-1 block w-full h-24 rounded-md border-2 border-blue-300 outline-none p-2"
            name="message"
          />
        </label>
        <input
          type="submit"
          value="Send"
          className="w-full h-10 bg-[#0F58B6] text-white font-bold rounded-md hover:bg-blue-600 cursor-pointer"
        />
      </form>
      <ToastContainer />
    </section>
  );
};

export default ContactUs;
