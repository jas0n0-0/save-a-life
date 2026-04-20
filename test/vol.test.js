/**
 * @jest-environment jsdom
 */
 
jest.mock("emailjs-com", () => ({
  send: jest.fn(),
}));
 
// Import AFTER mock is registered so vol.js gets the mocked module
const emailjs = require("emailjs-com");
 
describe("Volunteer Form Submission", () => {
  let form, submitBtn, status;
 
  beforeEach(() => {
    document.body.innerHTML = `
      <form class="vol-form">
        <input id="name" value="John Doe" />
        <input id="email" value="john@example.com" />
        <input id="phone" value="123456789" />
        <input id="skills" value="JS" />
        <select id="availability">
          <option value="Full-time" selected>Full-time</option>
        </select>
        <textarea id="message">Hello</textarea>
        <button id="submit">Submit Application</button>
      </form>
      <div id="form-status"></div>
    `;
 
    // Remove stale module cache so vol.js re-runs and re-binds the listener
    jest.resetModules();
    // Re-require the mock after resetModules so emailjs still points to the mock
    const freshEmailjs = require("emailjs-com");
    // Carry over the mock implementation to the module-level emailjs reference
    emailjs.send = freshEmailjs.send;
 
    // Expose the same mock on global so vol.js's bare `emailjs` reference works
    global.emailjs = emailjs;
 
    require("../public/vol.js");
 
    form      = document.querySelector(".vol-form");
    submitBtn = document.getElementById("submit");
    status    = document.getElementById("form-status");
  });
 
  afterEach(() => {
    jest.clearAllMocks();
    delete global.emailjs;
  });
 
  test("should submit form successfully", async () => {
    emailjs.send.mockResolvedValue({ status: 200 });
 
    form.dispatchEvent(new Event("submit"));
 
    // Flush all pending microtasks/promises
    await new Promise((resolve) => setTimeout(resolve, 0));
 
    expect(emailjs.send).toHaveBeenCalledWith(
      "service_62k1vzd",
      "template_z3dg8yj",
      {
        to_name:      "John Doe",
        to_email:     "john@example.com",
        phone:        "123456789",
        skills:       "JS",
        availability: "Full-time",
        message:      "Hello",
      }
    );
 
    expect(status.textContent).toContain("Application submitted");
    expect(status.style.color).toBe("green");
    expect(submitBtn.disabled).toBe(true);
  });
 
  test("should handle submission failure", async () => {
    emailjs.send.mockRejectedValue(new Error("Network error"));
 
    form.dispatchEvent(new Event("submit"));
 
    // Flush all pending microtasks/promises
    await new Promise((resolve) => setTimeout(resolve, 0));
 
    expect(status.textContent).toContain("Submission failed");
    expect(status.style.color).toBe("red");
    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.textContent).toBe("Submit Application");
  });
});
 