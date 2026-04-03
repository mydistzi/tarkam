//import ChangeEventHandler, FormEventHandler from react
import type { ChangeEventHandler, FormEventHandler } from "react";

interface WriteProps {
  isSubmit: FormEventHandler;
  handleChange: ChangeEventHandler;
  valueName: string;
  valueEmail: string;
  valuePhone: string;
  valueMessage: string;
}

function Writes({
  isSubmit,
  handleChange,
  valueName,
  valueEmail,
  valuePhone,
  valueMessage,
}: WriteProps) {
  return (
      <form onSubmit={isSubmit}>
          <div className="col-md-6 agilecontactdist-grid agilecontactdist-grid-1">
              <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={valueName}
                  onChange={handleChange}
                  placeholder="Name"
                  autoComplete="name"
                  required
              />
              <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={valuePhone}
                  onChange={handleChange}
                  placeholder="Phone"
                  autoComplete="mobile"
              />
              <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={valueEmail}
                  onChange={handleChange}
                  placeholder="Email"
                  autoComplete="email"
                  required
              />
          </div>
          <div className="col-md-6 agilecontactdist-grid agilecontactdist-grid-2">
              <textarea
                  name="message"
                  value={valueMessage}
                  onChange={handleChange}
                  placeholder="Message"
                  required
              ></textarea>
              <div className="send-button">
                  <input type="submit" value="Send" />
              </div>
          </div>
      </form>
  );
}

export default Writes;
