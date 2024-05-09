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
var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      const response = await fetch('/api/api', {
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
    const element = document.getElementById('output_box');
    if (!element) return;
    var html = htmlToPdfmake(`${element.innerHTML}`);
    var docDefinition = {
      content: html,
    };
    pdfMake.createPdf(docDefinition).open();
    // htmlToPdf(element).then((dataUri) => {
    //   const link = document.createElement('a');
    //   link.download = 'output.pdf';
    //   link
    //     .setAttribute('href', dataUri);
    //   link.click();
    // });
  };

  // The dimensions of a single A4 page; what we're basing the PDF document on.
  const A4_MARGIN_PX = 40;
  const A4_CONTENT_WIDTH_PX = 640;
  const A4_PORTRAIT_RATIO = 1.414;
  const A4_CONTENT_HEIGHT_PX = A4_CONTENT_WIDTH_PX * A4_PORTRAIT_RATIO;
  const A4_TOTAL_WIDTH_PX = A4_CONTENT_WIDTH_PX + A4_MARGIN_PX * 2;
  const A4_TOTAL_HEIGHT_PX = A4_CONTENT_HEIGHT_PX + A4_MARGIN_PX * 2;

  // Will return a data URI string.
  const htmlToPdf = async (element: HTMLElement): Promise<string> => {
    const elementBounds = element.getBoundingClientRect();

    const pdfBounds = [A4_TOTAL_WIDTH_PX, A4_TOTAL_HEIGHT_PX];
    const pdf = new jsPDF('portrait', 'px', pdfBounds);

    // These settings are optional, but I've found they help with file size and retina display support.
    const pdfAsImage = await toJpeg(element, {
      quality: 1,
      pixelRatio: 2,
    });
    // // download this image
    const link = document.createElement('a');
    link.download = 'output.jpg';
    link.setAttribute('href', pdfAsImage);
    link.click();

    const totalPages = Math.ceil(elementBounds.height / A4_CONTENT_HEIGHT_PX);

    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      // Add a page as long as it's not the first page, as jsPDF does this automatically.
      // This will focus the added page, as a side-effect.
      if (pageNum > 0) pdf.addPage(pdfBounds);

      pdf.addImage(
        pdfAsImage,
        'jpg',

        // Reposition the image based on the page number.
        A4_MARGIN_PX,
        A4_MARGIN_PX - pageNum * (A4_CONTENT_HEIGHT_PX + A4_MARGIN_PX * 2),

        A4_CONTENT_WIDTH_PX,
        elementBounds.height
      );
    }

    return pdf.output('datauristring');
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
