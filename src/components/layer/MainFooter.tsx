const MainFooter = () =>
  <footer
    className="footer p-10 bg-neutral text-neutral-content"
  >
    <div className="footer container mx-auto">
      <nav>
        <header className="footer-title">SOCIALS</header>
        <a className="link link-hover">Twitter</a>
        <a className="link link-hover">Discord</a>
        <a className="link link-hover">Github</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <header className="footer-title">RESOURCES</header>
        <a className="link link-hover">Medium</a>
        <a className="link link-hover">Docs</a>
        <a className="link link-hover">Brand book</a>
      </nav>
      <nav>
        <header className="footer-title">LEGAL</header>
        <a className="link link-hover">Terms of services</a>
        <a className="link link-hover">Risk disclaimer</a>
        <a className="link link-hover">Privacy policy</a>
      </nav>
    </div>
  </footer>

export default MainFooter;
