import {
  Button,
  Container,
  render,
  VerticalSpace,
  IconSwap16,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h, JSX } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { InsertSingleHandler, SelectionChangeHandler } from "./types";

function convertDataURIToBinary(dataURI: string) {
  var raw = window.atob(dataURI);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const SINGLE_IMAGE = "Single image";
const MULTIPLE_IMAGE = "Multiple images";

function Plugin() {
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(SINGLE_IMAGE);
  const [numberInputValue, setNumberInputValue] = useState("1");
  const [imageData, setImageData] = useState("");
  const [nodeSelected, setNodeSelected] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    fetch("https://person-generator-backend.vercel.app/api/person")
      .then((response) => response.json())
      .then((data) => setImageData(data.personImage));
  }, [imageCount]);

  useEffect(() => {
    const image = imageRef.current as unknown as HTMLImageElement;
    if (imageData) {
      image.src = `data:image/png;base64,${imageData}`;
    }
  }, [imageData]);

  const handleTabChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setTabValue(newValue);
    },
    [setTabValue]
  );

  const handleRefreshImage = useCallback(() => {
    setImageCount((imageCount) => imageCount + 1);
    setLoading(true);
  }, [setImageCount]);

  const handleInsertSingleImage = useCallback(
    function () {
      emit<InsertSingleHandler>(
        "INSERT_SINGLE",
        convertDataURIToBinary(imageData),
        !nodeSelected
      );
    },
    [imageData, nodeSelected]
  );

  const handleNumberInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setNumberInputValue(newValue);
    },
    [setNumberInputValue]
  );

  on<SelectionChangeHandler>("SELECTION_CHANGE", (selected: boolean) => {
    setNodeSelected(selected);
  });

  /* const tabOptions: Array<TabsOption> = [
    {
      children: (
        <div>
          <VerticalSpace space="small" />
          <img
            ref={imageRef}
            onLoad={(evt) => {
              setLoading(false);
            }}
            style={{ width: "100%" }}
          />
          <VerticalSpace space="small" />
          <Button
            loading={loading}
            secondary
            fullWidth
            onClick={handleRefreshImage}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <IconSwap16 />
              <div style={{ marginInlineStart: 8 }}>New Image</div>
            </div>
          </Button>
        </div>
      ),
      value: "Single image",
    },
    {
      children: (
        <div
          style={{
            height: 332,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}>
          <VerticalSpace space="small" />
          <div
            style={{
              width: "100%",
              height: "auto",
              flexGrow: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}>
            {[
              ...Array(
                parseInt(
                  numberInputValue !== undefined && numberInputValue.length > 0
                    ? numberInputValue
                    : "0"
                )
              ),
            ].map((value: undefined, index: number) => (
              <div
                style={{
                  width: 19,
                  height: 19,
                  margin: 4,
                  backgroundColor: "#dadada",
                }}></div>
            ))}
          </div>
          <VerticalSpace space="small" />
          <TextboxNumeric
            integer
            minimum={1}
            maximum={50}
            placeholder="Enter number of images (1-50)"
            icon={<IconGrid32 />}
            value={numberInputValue}
            onInput={handleNumberInput}
          />
        </div>
      ),
      value: "Multiple images",
    },
  ];*/

  return (
    <Container>
      <VerticalSpace space="small" />
      {/* <Tabs onChange={handleTabChange} options={tabOptions} value={tabValue} /> */}
      <img
        ref={imageRef}
        onLoad={(evt) => {
          setLoading(false);
        }}
        style={{ width: "100%", minHeight: 274, backgroundColor: "#dadada" }}
      />
      <VerticalSpace space="small" />
      <Button
        loading={loading}
        secondary
        fullWidth
        onClick={handleRefreshImage}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <IconSwap16 />
          <div style={{ marginInlineStart: 8 }}>New Image</div>
        </div>
      </Button>

      <VerticalSpace space="small" />
      <Button
        disabled={loading}
        fullWidth
        onClick={
          tabValue === MULTIPLE_IMAGE
            ? handleInsertSingleImage
            : handleInsertSingleImage
        }>
        {!nodeSelected && (
          <div>
            Insert
            {tabValue === MULTIPLE_IMAGE && " " + numberInputValue + " images"}
          </div>
        )}
        {nodeSelected && <div>Add image as fill</div>}
      </Button>
    </Container>
  );
}

export default render(Plugin);
