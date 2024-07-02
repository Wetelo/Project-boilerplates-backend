export const inviteUserHtml = ({
  username,
  link,
  expirationTime,
}: {
  username: string;
  link: string;
  expirationTime: string;
}) => {
  return `
        <div>
        <h1>Hello, ${username}</h1>
        <p>You were invited to the Boiler plate project</p>
        <p>Click <a href=${link}>here</a> to accept your invitation</p>
        <p><span style="color: red; font-weight: bold">Attention: </span> this link will be expired after ${expirationTime}</p>
        </div>
    `;
};
