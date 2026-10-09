import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, MapPin, Navigation2 } from "lucide-react";

export function LoginPage() {
  const isSignUp = window.location.pathname === "/signup";
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.title = `${isSignUp ? "Create account" : "Sign in"} | NaviSense`;
    return () => {
      document.title = "NaviSense | Smart Indoor Navigation";
    };
  }, [isSignUp]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.assign("/");
  };

  return (
    <main className="login-page">
      <section className="login-layout" aria-label={isSignUp ? "Create a NaviSense account" : "Sign in to NaviSense"}>
        <aside className="login-story">
          <a className="brand-lockup login-brand" href="/" aria-label="NaviSense home">
            <span className="brand-pin"><span /></span>
            <span>Navi<span>Sense</span></span>
          </a>

          <div className="login-story-copy">
            <span className="login-kicker"><span /> YOUR NEXT STOP, FOUND</span>
            <h1>Your way in<br />starts <span>here.</span></h1>
            <p>Pick up right where you left off. Your favorite places are just around the corner.</p>
          </div>

          <div className="login-map-card" aria-hidden="true">
            <div className="login-map-topline"><span>LEVEL 01</span><span> EAST WING</span></div>
            <svg className="login-map" viewBox="0 0 440 260" fill="none">
              <path d="M30 48h95v68h66V43h87v63h133M30 211h85v-55h76v59h89v-73h72v69h59M124 48v-26m67 94v48m87-58v-48m-87 126v64m105-74h45m27-48v-43" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M31 145h50m112-54h67m-44 120h70m-161-31h51m120-105v41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 7" />
              <path d="M75 49v36m246 83v29M279 44v20m-170 92v18m203-80h31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".48" />
              <path d="M61 145c53 0 44-61 103-61 56 0 44 76 104 76 53 0 42-52 105-52" stroke="#72b5ff" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" />
              <circle cx="61" cy="145" r="8" fill="#12b76a" stroke="white" strokeWidth="4" />
              <circle cx="373" cy="108" r="10" fill="#1a5cff" stroke="white" strokeWidth="4" />
              <path d="M373 89c-6.6 0-12 5.2-12 11.7 0 9 12 21.3 12 21.3s12-12.3 12-21.3c0-6.5-5.4-11.7-12-11.7Z" fill="#1a5cff" />
              <circle cx="373" cy="101" r="3.5" fill="white" />
            </svg>
            <div className="login-map-destination"><span><MapPin size={15} aria-hidden="true" /> DESTINATION FOUND</span><Navigation2 size={17} aria-hidden="true" /></div>
          </div>

          <p className="login-story-footer"><span>01</span> Find your way inside.</p>
        </aside>

        <div className="login-form-side">
          <a className="login-back-link" href="/" aria-label="Back to NaviSense home">
            <ArrowLeft size={16} aria-hidden="true" /> Back to home
          </a>
          <div className="login-form-wrap">
            <div className="login-heading">
              <span className="login-mobile-mark"><MapPin size={16} aria-hidden="true" /> NAVISENSE</span>
              <h2>{isSignUp ? "Create your account" : "Welcome back"}</h2>
              <p>{isSignUp ? "A better way to find your way around starts here." : "Sign in to continue your journey."}</p>
            </div>

            <div className="login-demo-note" role="status" aria-live="polite">
              <span className="login-note-dot" aria-hidden="true" />
              Demo mode — continue to explore NaviSense. Your details are not saved.
            </div>

            <form className="login-form" onSubmit={submit} noValidate>
              {isSignUp && (
                <div className="login-field">
                  <label htmlFor="signup-name">Full name</label>
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={120}
                    placeholder="Your name"
                  />
                </div>
              )}

              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  placeholder="you@example.com"
                />
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="login-password">{isSignUp ? "Create password" : "Password"}</label>
                  {!isSignUp && (
                    <button
                      className="login-text-button"
                      type="button"
                      onClick={() => setFeedback("Password reset is not available in this demo. Connect an authentication service to enable it.")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="login-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    maxLength={72}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  />
                  <button
                    className="login-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="login-field">
                  <label htmlFor="signup-confirm-password">Confirm password</label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    maxLength={72}
                    placeholder="Re-enter your password"
                  />
                </div>
              )}

              <button className="button button-primary login-submit" type="submit">
                {isSignUp ? "Create account" : "Sign in"} <ArrowRight size={17} aria-hidden="true" />
              </button>
              {feedback && <p className="login-feedback" role="status" aria-live="polite">{feedback}</p>}
            </form>

            <p className="login-help">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <a href={isSignUp ? "/login" : "/signup"}>{isSignUp ? "Sign in" : "Sign up"}</a>
            </p>
            <p className="login-security-note">Demo only. Sign-in details are not stored or sent anywhere.</p>
          </div>
          <footer className="login-copyright">© 2026 NaviSense <span>·</span> Find your way inside.</footer>
        </div>
      </section>
    </main>
  );
}
