export const verifyCodeHtml = ({
  username,
  code,
}: {
  username: string;
  code: string;
}) => {
  return `
        <div>
        <h1>Hello, ${username}</h1>
        <p>Here your verification code ${code}></p>
        </div>
    `;
};
