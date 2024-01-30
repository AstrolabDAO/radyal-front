const MainFooter = () =>
  <footer
    className="footer p-10"
  >
    <div className="footer container mx-auto relative">
      <nav>
        <header className="footer-title">SOCIALS</header>
        <a className="link link-hover" href="https://twitter.com/AstrolabDAO" rel="nofollow noopener">Twitter</a>
        <a className="link link-hover" href="https://discord.gg/M5RV26xMuu" rel="nofollow noopener">Discord</a>
        <a className="link link-hover" href="https://github.com/AstrolabDAO" rel="nofollow noopener">Github</a>
      </nav>
      <nav>
        <header className="footer-title">RESOURCES</header>
        <a className="link link-hover" href="https://medium.com/@AstrolabFi" rel="nofollow noopener">Medium</a>
        <a className="link link-hover" href="https://docs.astrolab.fi">Docs</a>
        <a className="link link-hover">Brand book</a>
      </nav>
      <nav>
        <header className="footer-title">LEGAL</header>
        <a className="link link-hover" href="/tos">Terms of services</a>
        <a className="link link-hover" href="/risk-disclaimer">Risk disclaimer</a>
        <a className="link link-hover" href="/privacy-policy">Privacy policy</a>
      </nav>
    </div>
  </footer>

export default MainFooter;
