import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
export const SocialNetworks = () => {
  return (
    <div className="flex flex-row mx-auto">
      <a href="https://twitter.com/AstrolabDAO" target="_blan">
        <FaTwitter className="h-8 w-8 mx-2" />
      </a>
      <a href="https://discord.gg/3k9U4C3K" target="_blank">
        <FaDiscord className="h-8 w-8 mx-2" />
      </a>
      <a href="https://github.com/AstrolabDAO" target="_blank">
        <FaGithub className="h-8 w-8 mx-2" />
      </a>
    </div>
  );
};
