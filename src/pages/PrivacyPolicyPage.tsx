import PrivacyPolicy from "~/assets/docs/privacy-policy.mdx";
import Layout from "~/components/layout/Layout";

const PrivacyPolicyPage = () => (
  <Layout>
    <div className="container mx-auto md list-disc">
      <PrivacyPolicy />
    </div>
  </Layout>
);

export default PrivacyPolicyPage;
