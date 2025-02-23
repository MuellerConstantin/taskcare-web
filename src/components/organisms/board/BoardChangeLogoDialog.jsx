import { useState, useCallback } from "react";
import Image from "next/image";
import { Button, Spinner, Modal, FileInput, Label } from "flowbite-react";
import useApi from "@/hooks/useApi";

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

const customClearButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

const customFileInputTheme = {
  "field": {
    "input": {
      "colors": {
        "gray": "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      }
    }
  }
};

export default function BoardChangeLogoDialog({show, boardId, onChange, onClose}) {
  const api = useApi();

  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState(null);

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const changeLogo = useCallback(async () => {
    setChangeLoading(true);
    setChangeError(null);

    const data = new FormData();
    data.append("file", selectedFile);

    api.post(`/boards/${boardId}/logo-image`, data, {headers: {"Content-Type": "multipart/form-data"}})
    .then(onChange)
    .catch((err) => {
      setChangeError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setChangeLoading(false);
    });
  }, [api, boardId, selectedFile]);

  const clearLogo = useCallback(async () => {
    setChangeLoading(true);
    setChangeError(null);

    api.delete(`/boards/${boardId}/logo-image`)
    .then(onChange)
    .catch((err) => {
      setChangeError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setChangeLoading(false);
    });
  }, [api, boardId]);

  return (
    <Modal size="lg" show={show} onClose={onClose}>
      <Modal.Header>Change Logo</Modal.Header>
      <Modal.Body className="space-y-4 flex flex-col">
        {changeError && (
          <p className="text-center text-red-500">{changeError}</p>
        )}
        <div className="flex flex-col space-y-6 text-gray-900 dark:text-white">
          <div>
            <div>
              <Label htmlFor="file-upload" value="Upload file" />
            </div>
            <FileInput
              id="file-upload"
              theme={customFileInputTheme}
              accept="image/*"
              helperText="SVG, PNG, JPG or GIF."
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {preview && (
            <div>
              <Label htmlFor="file-preview" value="Preview" />
              <div id="file-preview" className="flex justify-center">
                <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-48 h-48 relative overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customClearButtonTheme}
          color="light"
          disabled={changeLoading}
          onClick={clearLogo}
        >
          Clear Logo
        </Button>
        <Button
          theme={customButtonTheme}
          color="amber"
          type="submit"
          disabled={changeLoading || !selectedFile}
          onClick={changeLogo}
        >
          {!changeLoading && <span>Change Logo</span>}
          {changeLoading && <Spinner size="sm" className="fill-white" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
