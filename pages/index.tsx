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
  rem,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import Markdown from 'react-markdown';
import removeMarkdown from 'markdown-to-text';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import htmlToPdfmake from 'html-to-pdfmake';
import { jsPDF } from 'jspdf';

import domtoimage from 'dom-to-image';
import { PDFDocument } from 'pdf-lib';

import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures it's not loaded during server-side rendering
});
import 'react-quill/dist/quill.snow.css';
import wandIcon from '../images/right-icon.svg';
import { IconCopy, IconPrinter } from '@tabler/icons-react';
import { useColorScheme } from '@mantine/hooks';
type HomeProps = {
  theme?: string; // 'light' | 'dark'
};

const Home: FC<HomeProps> = (props) => {
  const [app_theme, setAppTheme] = useState<string>(props.theme || 'light');

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
      const response = await fetch(
        'https://dev-blueprint-ai.vercel.app/api/api',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectDescription,
          }),
        }
      ).then((res) => res.json());
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
          }, 10);
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
      var node = document.querySelector('#output_box .ql-editor');
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    app_theme === 'dark' ? 'dark' : 'light'
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    setAppTheme(value === 'dark' ? 'dark' : 'light');
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
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
            mt={'md'}
            radius={'25px'}
            label={
              <Text weight={700} size={'lg'}>
                Describe your next development idea
              </Text>
            }
            description={
              <Text size={'xs'}>
                Provide clear, detailed descriptions of your app&apos;s core
                functionalities, target audience, platform preferences, user
                interactions, and any specific requirements to get the best
                output.
              </Text>
            }
            placeholder={`Example:
"I want to build a mobile app for managing personal finances. Users should be able to create an account, link their bank accounts, and set budgets. The app should send notifications for upcoming bills and track spending habits. Security is a priority, so all financial data must be encrypted. The app should be developed using Flutter for both iOS and Android platforms."`}
            value={projectDescription}
            onChange={(event) =>
              setProjectDescription(event.currentTarget.value)
            }
            minRows={6}
            mx={{
              xs: 'auto',
              sm: 0,
            }}
            styles={{
              input: {
                padding: '16px',
                backgroundColor: 'transparent',
              },
            }}
          />

          <Flex justify={'flex-end'} my={16}>
            <Button
              leftIcon={
                <img
                  src={'right-icon.svg'}
                  style={{
                    width: '20px',
                    height: '20px',
                    color: 'white',
                  }}
                />
              }
              radius={'xl'}
              variant={app_theme !== 'dark' ? 'filled' : 'outline'}
              color="dark"
              disabled={loading || projectDescription === ''}
              styles={(theme) => ({
                root: {
                  backgroundColor: app_theme !== 'dark' ? '#000000' : '#ffff',
                  border: 0,
                  height: rem(42),
                  paddingLeft: rem(20),
                  paddingRight: rem(20),
                  '&:hover': {
                    backgroundColor:
                      app_theme === 'dark' ? '#808080' : '#333333',
                  },
                },
              })}
              onClick={handleGenerate}
              loading={loading}
            >
              Generate Blueprint
            </Button>
          </Flex>

          {output !== '' && (
            <>
              <QuillEditor
                value={output}
                theme="snow"
                onChange={(value) => {
                  setOutput(value);
                }}
                id={'output_box'}
                style={{
                  borderRadius: '25px',
                }}
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ size: ['small', false, 'large', 'huge'] }], // text size options
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction
                    [
                      {
                        align: [],
                      },
                    ],
                    // ['link', 'image', 'video'],
                    ['clean'], // remove formatting button
                  ],
                }}
              />
              <Flex justify={'flex-end'} mt={12} gap={8}>
                <Button
                  leftIcon={<IconCopy size={20} stroke={1} />}
                  radius={'xl'}
                  variant={app_theme !== 'dark' ? 'filled' : 'outline'}
                  color="dark"
                  // disabled={loading || projectDescription === ''}
                  styles={(theme) => ({
                    root: {
                      backgroundColor:
                        app_theme !== 'dark' ? '#000000' : '#ffff',
                      border: 0,
                      height: rem(42),
                      paddingLeft: rem(20),
                      paddingRight: rem(20),
                      '&:hover': {
                        backgroundColor:
                          app_theme === 'dark' ? '#808080' : '#333333',
                      },
                    },
                  })}
                  onClick={() => {
                    navigator.clipboard.writeText(getText());
                  }}
                  disabled={output === '' || loading}
                >
                  {/* Save Project on Microapp */}
                  Copy Text
                </Button>
                <Button
                  leftIcon={<IconPrinter size={20} stroke={1} />}
                  radius={'xl'}
                  variant={app_theme !== 'dark' ? 'filled' : 'outline'}
                  color="dark"
                  // disabled={loading || projectDescription === ''}
                  styles={(theme) => ({
                    root: {
                      backgroundColor:
                        app_theme !== 'dark' ? '#000000' : '#ffff',
                      border: 0,
                      height: rem(42),
                      paddingLeft: rem(20),
                      paddingRight: rem(20),
                      '&:hover': {
                        backgroundColor:
                          app_theme === 'dark' ? '#808080' : '#333333',
                      },
                    },
                  })}
                  onClick={handlePrint}
                  disabled={output === '' || loading}
                >
                  Print a PDF
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Home;
