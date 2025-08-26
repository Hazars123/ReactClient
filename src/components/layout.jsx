import Header from "./header";
import Footer from "./Footer";
import Chatbot from "./chat/Chatbot";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;

