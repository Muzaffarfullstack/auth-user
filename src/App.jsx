import { FiUser } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function App() {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [codes, setCodes] = useState(Array(6).fill(""));
  const [serverCode, setServerCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // generate 6 digit number randomly
  const generateCode = () => Math.floor(100000 + Math.random() * 900000);

  // sending mock code
  const sendCode = () => {
    const newCode = generateCode();
    setServerCode(newCode);
    setTimeLeft(50);
    setCodes(Array(6).fill(""));
    toast.success(`Code sent to ${email}: ${newCode}`);
    console.log(typeof newCode);
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email && !password) return toast.warning("Enter an email");
    setStep("2fa");
    sendCode();
  };

  // Timer
  useEffect(() => {
    if (step !== "2fa") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // 2FA input handling
  const handleChange = (val, index) => {
    if (!/^\d*$/.test(val)) return; // only number here
    const newCode = [...codes];
    newCode[index] = val;
    setCodes(newCode);
  };

  // 2FA verify
  const handleVerify = () => {
    if (codes.join("") === String(serverCode)) {
      setStatus("success");
      toast.success(" Code correct — access granted!");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="container bg-white text-center relative top-[150px] w-[400px] left-[500px]">
      <h1 className="font-bold m-5">Company</h1>

      {step === "login" ? (
        <form onSubmit={handleLogin}>
          <p className="font-bold text-xl">
            Sign in to your account to <br /> continue
          </p>
          <div className="account-items gap-2">
            <div
              className="flex items-center gap-2 m-2 p-1 rounded-md border border-gray-500 
                         focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              <FiUser className="mt-1 ml-2" />
              <input
                type="email"
                placeholder="Email"
                className="border-0 outline-0"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div
              className="flex items-center gap-2 m-2 p-1 rounded-md border border-gray-500 
                         focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              <FaLock className="mt-1 ml-2" />
              <input
                type="password"
                placeholder="Password"
                className="border-0 outline-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-[96%] rounded-md cursor-pointer bg-blue-700 border-0 text-neutral-50 p-1">
              Login
            </button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <h1 className="font-bold text-xl m-2">Two-Factor Authentication</h1>
            Enter the 6-digit code from the Google <br /> Authenticator App
            <div className="">
              <div className="flex justify-center mt-2">
                {codes.map((code, index) => (
                  <input
                    type="text"
                    value={code}
                    key={index}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className={`m-1 my-1.5 w-12 h-12 text-center border rounded text-xl ${
                      status === "success"
                        ? "border-green-500"
                        : status === "error"
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300`}
                  />
                ))}
              </div>

              <button
                className="border w-[90%] my-2 p-1 bg-blue-700 text-neutral-50 cursor-pointer rounded"
                onClick={handleVerify}
              >
                Verify
              </button>

              <div>
                {timeLeft > 0 ? (
                  <span>Time left: {timeLeft}s</span>
                ) : (
                  <button
                    onClick={sendCode}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
