// Dropbox Sign SDK
import { SignatureRequestApi, SubSigningOptions } from "@dropbox/sign";

const dropbox = new SignatureRequestApi();
dropbox.username = "API KEY";

const dropboxReturn = await dropbox.signatureRequestSendWithTemplate({
  templateIds: ["TEMPLATE ID"],
  subject: "Minneapolis Winter League - Release of Liability",
  message:
    "We're so excited you decided to join Minneapolis Winter League. " +
    "Please make sure to sign this Release of Liability to finalize " +
    "your participation. Looking forward to seeing you!",
  signers: [
    {
      role: "Participant",
      name: `Name`,
      emailAddress: "email",
    },
  ],
  signingOptions: {
    draw: true,
    type: true,
    upload: true,
    phone: false,
    defaultType: SubSigningOptions.DefaultTypeEnum.Type,
  },
  testMode: true,
});
