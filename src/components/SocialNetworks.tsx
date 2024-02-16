import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import Github from "~/assets/icons/github.svg?react";
import Discord from "~/assets/icons/discord.svg?react";
import X from "~/assets/icons/x.svg?react";
export const SocialNetworks = () => {
  return (
    <div className="flex flex-row mx-auto">
      <a
        href="https://twitter.com/AstrolabDAO"
        target="_blank"
        className="fill-white hover:fill-primary"
      >
        <X className="h-8 w-8 mx-2" />
      </a>
      <a
        href="https://discord.gg/3k9U4C3K"
        target="_blank"
        className="fill-white hover:fill-primary"
      >
        <Discord className="h-8 w-8 mx-2" />
      </a>
      <a
        href="https://github.com/AstrolabDAO"
        target="_blank"
        className="fill-white hover:fill-primary"
      >
        <Github className="h-8 w-8 mx-2" />
      </a>
    </div>
  );
};
