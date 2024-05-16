import { FC, useState } from 'react';
import {
  Select,
  TextInput,
  Box,
  Flex,
  NumberInput,
  Textarea,
  Divider,
  Text,
  Grid,
  Button,
  CopyButton,
} from '@mantine/core';
import Markdown from 'react-markdown';
import removeMarkdown from 'markdown-to-text';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import htmlToPdfmake from 'html-to-pdfmake';
import { jsPDF } from 'jspdf';

import domtoimage from 'dom-to-image';
import { PDFDocument } from 'pdf-lib';

const Home: FC = () => {
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleGenerate = async () => {
    // check valid input
    if (projectDescription === '') {
      alert('Please enter a project description');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://dev-blueprint-ai.vercel.app/api/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription,
        }),
      }).then((res) => res.json());
      console.log(response);
      const { text } = response;
      const words = text.split(' ');
      var currenIndex = 0;
      var outputText = '';
      const displayWord = () => {
        if (words.length > currenIndex) {
          setTimeout(() => {
            outputText =
              outputText +
              (outputText !== '' ? ' ' : outputText) +
              words[currenIndex];
            setOutput(outputText);
            currenIndex++;
            displayWord();
          }, 100);
        } else {
          setLoading(false);
        }
      };
      displayWord();
      // setLoading(false);
    } catch (err) {
      alert('Something went wrong');
      console.log(err);
      setLoading(false);
    }
  };

  const getText = () => {
    const text = removeMarkdown(output);
    return text;
  };

  const handlePrint = () => {
    try {
      var node = document.getElementById('output_box');
      if (!node) {
        return;
      }
      let scale = 4;
      domtoimage
        .toPng(node as HTMLElement, {
          width: node.scrollWidth * scale,
          height: node.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
          },
        })
        .then(async function (dataUrl) {
          // convert it to pdf
          const pdfDoc = await PDFDocument.create();
          const pdfImage = await pdfDoc.embedPng(dataUrl);
          const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: pdfImage.width,
          });
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'blueprint.pdf';
          link.click();
        });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Box
        w={{
          md: 800,
          lg: 900,
          base: '100%',
        }}
        p={8}
        mx={'auto'}
        my={{
          md: 'lg',
          base: 'xl',
        }}
      >
        <Textarea
          label="Describe your next development idea"
          placeholder="Keep in mind that the more detailed the idea, the better the output will be."
          value={projectDescription}
          onChange={(event) => setProjectDescription(event.currentTarget.value)}
          minRows={5}
          mx={{
            xs: 'auto',
            sm: 0,
          }}
        />
        <Flex justify={'center'} my={12}>
          <Button
            color="violet"
            variant="light"
            w={{
              base: '100%',
              md: '250px',
            }}
            size="md"
            style={{
              border: '1px solid',
              boxShadow: '1px 1px 0px',
            }}
            onClick={handleGenerate}
            loading={loading}
          >
            Generate
          </Button>
        </Flex>
        <Box
          style={{
            border: output !== '' ? '1px solid #c7c7c7' : 'none',
            minHeight: '200px',
            borderRadius: '15px',
          }}
          id={'output_box'}
          p={'xl'}
        >
          <div>
            <Markdown>{output}</Markdown>
          </div>
        </Box>

        <Flex justify={'space-evenly'} mt={12}>
          <Button
            color="green"
            variant="light"
            size="sm"
            style={{
              border: '1px solid',
              boxShadow: '1px 1px 0px',
            }}
            onClick={() => {
              navigator.clipboard.writeText(getText());
            }}
          >
            {/* Save Project on Microapp */}
            Copy Text
          </Button>
          <Button
            color="green"
            variant="light"
            size="sm"
            style={{
              border: '1px solid',
              boxShadow: '1px 1px 0px',
            }}
            onClick={handlePrint}
            disabled={output === '' || loading}
          >
            Print a PDF
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
