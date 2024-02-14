import { Link } from "react-router-dom";

const MainFooter = () => (
  <footer className="footer pt-5 mt-5 border-t border-solid border-dark-800 w-full bg-blur">
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
        <div className="text-gray-600">Radyal - © 2024</div>
      </nav>
      <nav className="mx-auto mt-auto">
        <footer className="w-36 h-36 position-relative">
          <div className="absolute -bottom-10 w-36 h-36">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1468 1097"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1372.4 1096.23C1434.52 986.738 1468 862.095 1468 733.999C1468 539.33 1390.67 352.634 1253.02 214.983C1115.36 77.331 928.669 -0.000976562 734 -0.000976562C539.331 -0.000976562 352.635 77.331 214.984 214.983C77.3319 352.634 0 539.33 0 733.999C0 862.095 33.4839 986.738 95.6047 1096.23H249.982C178.099 1042.25 121.474 966.205 91.4639 873.112C42.2392 720.385 78.2661 551.517 184.949 431.844C310.508 291.007 512.251 241.872 689.412 311.369C689.63 311.448 689.71 311.606 689.65 311.844V311.874C689.571 312.112 689.412 312.201 689.175 312.141C558.711 284.676 425.454 317.878 323.557 402.595C132.158 561.713 116.195 846.003 283.22 1027.56C307.635 1054.11 335.059 1077.08 364.703 1096.23H491.551C373.769 1061.4 275.523 970.513 237.117 843.506C171.068 625.027 313.242 398.344 536.893 360.772C607.124 348.981 676.076 356.868 743.75 384.433C743.968 384.532 744.077 384.591 744.077 384.611V384.997C744.077 385.097 744.037 385.136 743.958 385.116C542.69 343.026 345.94 487.757 321.803 691.225C293.178 932.889 506.425 1128.18 744.671 1082.88C744.751 1082.88 744.79 1082.92 744.79 1083V1083.06C744.81 1083.14 744.79 1083.18 744.731 1083.18H744.017C743.799 1083.18 743.581 1083.23 743.363 1083.33C732.147 1088.48 720.624 1092.78 708.793 1096.23H878.498C896.274 1078.77 912.973 1059.81 928.431 1039.39C1079.23 840.296 1060.92 561.653 888.63 382.025C764.766 252.929 582.046 200.316 407.233 240.445C391.954 243.952 376.953 248.332 362.229 253.583C361.912 253.702 361.694 253.603 361.575 253.286C361.456 252.989 361.546 252.771 361.843 252.632C578.33 153.202 831.825 211.136 985.533 390.586C1148.6 580.945 1154.01 859.171 1002.77 1056.52C992.118 1070.42 980.883 1083.66 969.122 1096.23H1039.3C1040.86 1094.24 1042.41 1092.25 1043.94 1090.25C1296.16 760.841 1136.45 282.298 736.259 171.78C642.071 145.761 545.712 144.274 447.183 167.321C447.147 167.334 447.108 167.338 447.069 167.332C447.044 167.329 447.02 167.322 446.997 167.311C446.984 167.305 446.971 167.298 446.959 167.29C446.925 167.267 446.896 167.237 446.873 167.202C446.85 167.166 446.834 167.126 446.827 167.083C446.817 167.009 446.808 166.936 446.799 166.866C446.837 166.934 446.906 166.947 447.005 166.905C728.917 63.4619 1042.37 178.052 1188.26 441.386C1274.49 597.056 1287.93 788.544 1222.08 954.38C1201.52 1006.18 1174.73 1053.65 1142.9 1096.23H1208.51C1246.68 1038.27 1276.26 973.179 1295 902.213C1361.67 649.491 1272.44 381.847 1068.47 219.281C908.872 92.0872 701.719 46.489 502.175 94.5246C501.937 94.584 501.778 94.4949 501.699 94.2571V94.2273C501.62 93.9895 501.699 93.831 501.937 93.7517C738.251 10.8784 994.153 57.0711 1182.37 222.045C1437.17 445.384 1486.31 815.445 1310.32 1096.23H1372.4ZM797.225 1010.68C797.067 1011 796.74 1011.18 796.244 1011.24C795.808 1011.32 795.462 1011.41 795.204 1011.51C693.96 1055.89 576.16 1040.32 489.75 973.315C370.433 880.781 337.022 713.37 413.089 582.282C490.195 449.501 651.84 396.977 792.618 455.03C799.038 457.685 798.821 458.458 791.964 457.348C620.064 429.526 464.097 570.333 470.726 744.046C477.146 912.676 629.546 1037.85 796.868 1010.2C797.304 1010.12 797.423 1010.28 797.225 1010.68ZM960.349 647.137C971.755 674.676 977.626 704.192 977.626 733.999C977.626 763.806 971.755 793.322 960.349 820.861C948.942 848.399 932.222 873.421 911.145 894.498C890.068 915.575 865.046 932.294 837.508 943.701C809.969 955.108 780.453 960.979 750.646 960.979C690.447 960.979 632.714 937.065 590.147 894.498C547.58 851.931 523.666 794.198 523.666 733.999C523.666 673.8 547.58 616.067 590.147 573.5C632.714 530.933 690.447 507.019 750.646 507.019C780.453 507.019 809.969 512.89 837.508 524.297C865.046 535.703 890.068 552.423 911.145 573.5C932.222 594.577 948.942 619.599 960.349 647.137Z"
                fill="#3E3E3E"
              />
            </svg>
          </div>
        </footer>
      </nav>
    </div>
  </footer>
);

export default MainFooter;
