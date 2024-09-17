import { FC, useEffect, useState } from 'react';
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
  Switch,
} from '@mantine/core';
import Markdown from 'react-markdown';
import removeMarkdown from 'markdown-to-text';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import htmlToPdfmake from 'html-to-pdfmake';
import { jsPDF } from 'jspdf';
import useTranslation from 'next-translate/useTranslation';
import domtoimage from 'dom-to-image';
import { PDFDocument } from 'pdf-lib';

import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures it's not loaded during server-side rendering
});
import 'react-quill/dist/quill.snow.css';

import { IconCopy, IconPrinter } from '@tabler/icons-react';
import { useColorScheme } from '@mantine/hooks';
import StyledButton from '@/components/StyledButton';
import { useRouter } from 'next/router';
type HomeProps = {
  theme?: string; // 'light' | 'dark'
};

const Home: FC<HomeProps> = (props) => {
  // App theme setup
  const [app_theme, setAppTheme] = useState<string>(props.theme || 'light');
  const toggleColorScheme = (value?: ColorScheme) => {
    console.log('Toggle color scheme', value);
    setAppTheme(value === 'dark' ? 'dark' : 'light');
  };
  useEffect(() => {
    if (props.theme) {
      toggleColorScheme(props.theme === 'dark' ? 'dark' : 'light');
    }
  }, [props.theme]);
  const router = useRouter();
  const { t, lang: currentLang } = useTranslation('common');
  const [language, setLanguage] = useState(currentLang);
  useEffect(() => {
    const { lang } = router.query;
    console.log('Current Lang: ', lang);
    if (
      lang &&
      ['en', 'es', 'fr', 'pt'].includes(lang as string) &&
      lang !== currentLang
    ) {
      // Update the locale without reloading the page
      setLanguage(lang as string);
      router.push(router.pathname, router.asPath, {
        locale: lang as string,
        shallow: true,
      });
    }
  }, [router.query, currentLang, router]);

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

  return (
    <ColorSchemeProvider
      colorScheme={app_theme === 'dark' ? 'dark' : 'light'}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme: app_theme === 'dark' ? 'dark' : 'light' }}
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
                {t('input-title')}
              </Text>
            }
            description={<Text size={'xs'}>{t('input-desc')}</Text>}
            placeholder={t('input-placeholder')}
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
            <StyledButton
              label={t('generate-label')}
              app_theme={app_theme}
              icon={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 4.33341V2.66675M13.5 14.3334V12.6667M7.66667 8.50008H9.33333M17.6667 8.50008H19.3333M15.8333 10.8334L16.8333 11.8334M15.8333 6.16675L16.8333 5.16675M3.5 18.5001L11 11.0001M11.1667 6.16675L10.1667 5.16675"
                    stroke="#909098"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              loading={loading}
              disabled={projectDescription === ''}
              onClick={handleGenerate}
            />
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
                <StyledButton
                  label={t('copy-label')}
                  app_theme={app_theme}
                  icon={<IconCopy size={20} stroke={1} />}
                  loading={loading}
                  disabled={output === ''}
                  onClick={() => {
                    navigator.clipboard.writeText(getText());
                  }}
                />
                <StyledButton
                  label={t('print-label')}
                  app_theme={app_theme}
                  icon={<IconPrinter size={20} stroke={1} />}
                  loading={loading}
                  disabled={output === ''}
                  onClick={handlePrint}
                />
              </Flex>
            </>
          )}
        </Box>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default Home;
