/**
 * @jest-environment jsdom
 */

const emailjs = require("emailjs-com");

jest.mock("emailjs-com", () => ({
  send: jest.fn(),
}));

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

    global.emailjs = {
  send: jest.fn(),
};

    require("../vol.js");

    form = document.querySelector(".vol-form");
    submitBtn = document.getElementById("submit");
    status = document.getElementById("form-status");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should submit form successfully", async () => {
    emailjs.send.mockResolvedValue({ status: 200 });

    const event = new Event("submit");
    form.dispatchEvent(event);

    // Wait for async code
    await Promise.resolve();

    expect(emailjs.send).toHaveBeenCalledWith(
      "service_62k1vzd",
      "template_z3dg8yj",
      {
        to_name: "John Doe",
        to_email: "john@example.com",
        phone: "123456789",
        skills: "JS",
        availability: "Full-time",
        message: "Hello",
      }
    );

    expect(status.textContent).toContain("Application submitted");
    expect(status.style.color).toBe("green");
    expect(submitBtn.disabled).toBe(true);
  });

  test("should handle submission failure", async () => {
    emailjs.send.mockRejectedValue(new Error("Network error"));

    const event = new Event("submit");
    form.dispatchEvent(event);

    await Promise.resolve();

    expect(status.textContent).toContain("Submission failed");
    expect(status.style.color).toBe("red");
    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.textContent).toBe("Submit Application");
  });
});