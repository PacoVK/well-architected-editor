import { Box } from "@cloudscape-design/components";

export default function About() {
  return (
    <>
      <Box variant="h3">Purpose</Box>
      <Box variant="p">
        This is a tool for creating and editing AWS Well-Architected Lenses. It
        is built with ❤️ , 🤘,{" "}
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          React
        </a>{" "}
        and{" "}
        <a href="https://cloudscape.design" target="_blank" rel="noreferrer">
          Cloudscape Design System
        </a>
        .
      </Box>
      <Box variant="h3">Principles and Goals</Box>
      <Box variant="div">
        The editor is built with the following principles and goals:
        <ul>
          <li>
            Local editing and saving. <strong>Data is not sent anywhere</strong>
            , it is stored in the browser's local storage and{" "}
            <strong>won't leave your computer</strong>.
          </li>
          <li>
            The editor should make it easy to create and edit lenses. -{" "}
            <strong>No need to edit JSON files</strong>.
          </li>
          <li>
            Validate your lens <strong>before</strong> uploading it to AWS
            Well-Architected Tool. - Easy to spot mistakes and fix them.
          </li>
        </ul>
      </Box>
      <Box variant="h3">Creator</Box>
      <Box variant="p">
        <a href="https://github.com/pacovk" target="_blank" rel="noreferrer">
          Pascal Euhus
        </a>
      </Box>
      <Box variant="h3">Source Code</Box>
      <Box variant="p">
        The source code is available on{" "}
        <a
          href="https://github.com/PacoVK/well-architected-editor"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </Box>
    </>
  );
}
