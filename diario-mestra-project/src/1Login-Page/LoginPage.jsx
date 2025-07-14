import LoginHeader from './LoginHeader';
import LoginBox from './LoginBox';
import './Login.css';

function LoginPage() {
  return (
    <>
      <LoginHeader />

      <main className="container">
        <LoginBox />
      </main>
    </>
  );
}

export default LoginPage;
