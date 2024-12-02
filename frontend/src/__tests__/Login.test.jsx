import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import LogIn from "./../pages/LogIn";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("LogIn Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    sessionStorage.clear();
  });

  it("로그인 컴포넌트들 랜딩 확인", () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인/ })).toBeInTheDocument();
  });

  it("이메일 비밀번호 입력 확인", () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@scholpion.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    expect(emailInput.value).toBe("test@scholpion.com");
    expect(passwordInput.value).toBe("password");
  });

  it("로그인 작동여부 확인", async () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /로그인/i });

    fireEvent.change(emailInput, {
      target: { value: "dldbsrl@scholpion.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("fake-jwt-token");
      expect(sessionStorage.getItem("user")).toBe(
        JSON.stringify({ email: "dldbsrl@scholpion.com", name: "이윤기" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  //   it("shows an error with incorrect credentials", async () => {
  //     render(
  //       <MemoryRouter>
  //         <LogIn />
  //       </MemoryRouter>
  //     );

  //     const emailInput = screen.getByLabelText(/email address/i);
  //     const passwordInput = screen.getByLabelText(/password/i);
  //     const loginButton = screen.getByRole("button", { name: /로그인/i });

  //     fireEvent.change(emailInput, { target: { value: "wrong@scholpion.com" } });
  //     fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
  //     await userEvent.click(loginButton);

  //     await waitFor(() => {
  //       expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  //       expect(sessionStorage.getItem("token")).toBeNull();
  //       expect(sessionStorage.getItem("user")).toBeNull();
  //     });
  //   });
});
