import { Link } from "react-router-dom";
import SimpleLogo from "~/assets/logo/simple-logo.svg?react";
const MainFooter = () => (
  <footer className="footer pt-5 mt-5 border-t border-t-2 border-solid border-darkerGrey w-full bg-blur">
    <div className="footer container mx-auto relative overflow-y-hidden pb-5 px-2 ">
      <nav>
        <header className="footer-title gilroy text-xl mb-0">SOCIALS</header>
        <a
          className="link link-hover hover:text-primary"
          href="https://twitter.com/AstrolabDAO"
          target="_blank"
          rel="nofollow noopener"
        >
          Twitter
        </a>
        <a
          className="link link-hover hover:text-primary"
          href="https://discord.gg/M5RV26xMuu"
          rel="nofollow noopener"
          target="_blank"
        >
          Discord
        </a>
        <a
          className="link link-hover hover:text-primary"
          href="https://github.com/AstrolabDAO"
          rel="nofollow noopener"
          target="_blank"
        >
          Github
        </a>
      </nav>
      <nav className="mx-auto">
        <header className="footer-title gilroy text-xl mb-0">RESOURCES</header>
        <a
          className="link link-hover hover:text-primary"
          href="https://medium.com/@AstrolabFi"
          rel="nofollow noopener"
          target="_blank"
        >
          Medium
        </a>
        <a
          className="link link-hover hover:text-primary"
          href="https://docs.astrolab.fi"
          target="_blank"
        >
          Docs
        </a>

        <a
          href="/documents/astrolab-brand-kit.zip"
          target="_blank"
          className="link link-hover hover:text-primary"
        >
          Brand book
        </a>
      </nav>
      <nav className="place-self-end">
        <header className="footer-title gilroy text-xl mb-0">LEGAL</header>
        <Link
          to="/terms-of-service"
          className="link link-hover hover:text-primary"
        >
          Terms of services
        </Link>
        <Link
          to="/risk-disclaimer"
          className="link link-hover hover:text-primary"
        >
          Risk disclaimer
        </Link>
        <Link
          to="/privacy-policy"
          className="link link-hover hover:text-primary"
        >
          Privacy policy
        </Link>
        <div className="text-tertiary">Radyal - © 2024</div>
      </nav>
      <nav className="mx-auto mt-auto">
        <footer className="w-36 h-36 position-relative">
          <div className="absolute w-36 h-36">
            <SimpleLogo fill="#3E3E3E" />
          </div>
        </footer>
      </nav>
    </div>
  </footer>
);

export default MainFooter;
