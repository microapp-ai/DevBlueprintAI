import { FC, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Textarea,
  Text,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  Slider,
} from '@mantine/core';
import removeMarkdown from 'markdown-to-text';
import useTranslation from 'next-translate/useTranslation';
import domtoimage from 'dom-to-image';
import { PDFDocument } from 'pdf-lib';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('react-quill'), {
  ssr: false, // This ensures it's not loaded during server-side rendering
});
import 'react-quill/dist/quill.snow.css';

import { IconCopy, IconPrinter } from '@tabler/icons-react';
import StyledButton from '@/components/StyledButton';
import { useRouter } from 'next/router';
type Language = 'en' | 'es' | 'pt';

type HomeProps = {
  theme?: string; // 'light' | 'dark'
  lang?: Language; // 'en' | 'es' | 'pt'
};

const Home: React.FC<HomeProps> = (props) => {
  useEffect(() => {
    console.log('props', props);
  }, [props]);
  // App theme setup
  const [app_theme, setAppTheme] = useState<string>(props.theme || 'light');
  const toggleColorScheme = (value?: ColorScheme) => {
    // console.log('Toggle color scheme', value);
    setAppTheme(value === 'dark' ? 'dark' : 'light');
  };
  useEffect(() => {
    if (props.theme) {
      toggleColorScheme(props.theme === 'dark' ? 'dark' : 'light');
    }
  }, [props.theme]);
  const [app_lang, setAppLang] = useState<'en' | 'es' | 'pt'>(
    props.lang || 'en'
  );
  useEffect(() => {
    // console.log('PROPS: ', props);
    if (props.lang) {
      if (props.lang != app_lang) {
        window.location.reload();
      }
      setAppLang(props.lang);
    }
  }, [props.lang]);

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
  const [boxMargin, setBoxMargin] = useState<number>(60);
  const handleWidths = () => {
    const app_container = document.getElementById('app_container');
    // console.log('App Container Width: ', app_container?.offsetWidth);
    if (app_container?.offsetWidth && app_container?.offsetWidth - 1160 > 120) {
      const margin = (app_container?.offsetWidth - 1160) / 2;
      if (700 + margin > app_container?.offsetWidth) {
        setBoxMargin(margin);
      } else {
        setBoxMargin((app_container?.offsetWidth - 700) / 2);
      }
    } else if (app_container?.offsetWidth) {
      const margin = 60;
      if (700 + margin > app_container?.offsetWidth) {
        setBoxMargin(margin);
      } else {
        setBoxMargin((app_container?.offsetWidth - 700) / 2);
      }
    } else {
      setBoxMargin(60);
    }
  };
  useEffect(() => {
    const app_container = document.getElementById('app_container');
    if (app_container) {
      // Create a new ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        handleWidths();
      });

      // Start observing the app_container element
      resizeObserver.observe(app_container);

      // Call the function initially
      handleWidths();

      // Cleanup the observer when the component unmounts
      return () => {
        if (app_container) {
          resizeObserver.unobserve(app_container);
        }
      };
    }
  }, []);
  return (
    <ColorSchemeProvider
      colorScheme={app_theme === 'dark' ? 'dark' : 'light'}
      toggleColorScheme={() => {}}
    >
      <style jsx global>{`
        .ql-toolbar {
          border: 1px solid ${app_theme === 'dark' ? '#2C2C30' : '#ccc'} !important;
          border-radius: 25px 25px 0 0;
        }
        .ql-container {
          border: 1px solid ${app_theme === 'dark' ? '#2C2C30' : '#ccc'} !important;
          border-radius: 0 0 25px 25px;
        }
        ${app_theme === 'dark'
          ? `.ql-toolbar svg,
.ql-toolbar rect,
.ql-toolbar line,
.ql-toolbar path,
.ql-toolbar span {
          /* fill: #ccc !important; */
          stroke: #ccc !important;
          color: #ccc !important; 
        }`
          : ''}

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent; /* Background of the scrollbar track */
        }

        ::-webkit-scrollbar-thumb {
          background-color: #888; /* Color of the scrollbar handle */
          border-radius: 10px;
          border: 3px solid transparent; /* Padding around the handle */
          background-clip: padding-box;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #555; /* Darker color when hovered */
        }
      `}</style>
      <MantineProvider
        theme={{ colorScheme: app_theme === 'dark' ? 'dark' : 'light' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Box id="app_container" w={'100%'}>
          <Box
            p={8}
            my={{
              md: 'lg',
              base: 'xl',
            }}
            maw={700}
            mx={boxMargin}
          >
            <Textarea
              mt={'md'}
              radius={'xl'}
              label={
                <Text weight={700} size={'xl'} mb={4}>
                  {translations[app_lang].INPUT_TITLE}
                </Text>
              }
              description={
                <Text size={'sm'} mb={12}>
                  {translations[app_lang].INPUT_DESC}
                </Text>
              }
              placeholder={translations[app_lang].INPUT_PLACEHOLDER}
              value={projectDescription}
              onChange={(event) =>
                setProjectDescription(event.currentTarget.value)
              }
              minRows={6}
              size="lg"
              mx={{
                xs: 'auto',
                sm: 0,
              }}
              styles={{
                input: {
                  padding: '16px',
                  backgroundColor: 'transparent',
                  border:
                    '1px solid ' + (app_theme === 'dark' ? '#2C2C30' : '#ccc'),
                },
              }}
              mb={24}
            />

            <Flex justify={'flex-end'} mb={32}>
              <StyledButton
                label={translations[app_lang].GENERATE_LABEL}
                app_theme={app_theme}
                icon={
                  <svg
                    width="18"
                    height="18"
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
                      // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                      // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                      // ['blockquote', 'code-block'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                      // [{ direction: 'rtl' }], // text direction
                      [
                        {
                          align: [],
                        },
                      ],
                      // ['link', 'image', 'video'],
                      // ['clean'], // remove formatting button
                    ],
                  }}
                />
                <Flex justify={'flex-end'} mt={24} gap={8} mb={48}>
                  <StyledButton
                    label={translations[app_lang].COPY_LABEL}
                    app_theme={app_theme}
                    icon={<IconCopy size={20} stroke={1} />}
                    loading={loading}
                    disabled={output === ''}
                    onClick={() => {
                      navigator.clipboard.writeText(getText());
                    }}
                  />
                  <StyledButton
                    label={translations[app_lang].PRINT_LABEL}
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
        </Box>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

const translations = {
  en: {
    INPUT_TITLE: 'Describe your next development idea',
    INPUT_DESC:
      "Provide clear, detailed descriptions of your app's functionalities, target audience, platform preferences, user interactions and any specific requirements to get the best output.",
    INPUT_PLACEHOLDER:
      'Example:\n"I want to build a mobile app for managing personal finances. Users should be able to create an account, link their bank accounts, and set budgets. The app should send notifications for upcoming bills and track spending habits. Security is a priority, so all financial data must be encrypted. The app should be developed using Flutter for both iOS and Android platforms."',
    GENERATE_LABEL: 'Generate Blueprint',
    COPY_LABEL: 'Copy Text',
    PRINT_LABEL: 'Print a PDF',
  },
  es: {
    INPUT_TITLE: 'Describe tu próxima idea de desarrollo',
    INPUT_DESC:
      'Proporciona descripciones claras y detalladas de las funcionalidades de tu aplicación, el público objetivo, las preferencias de plataforma, las interacciones del usuario y cualquier requisito específico para obtener el mejor resultado.',
    INPUT_PLACEHOLDER:
      'Ejemplo:\n"Quiero construir una aplicación móvil para gestionar finanzas personales. Los usuarios deben poder crear una cuenta, vincular sus cuentas bancarias y establecer presupuestos. La aplicación debe enviar notificaciones de facturas próximas y rastrear hábitos de gasto. La seguridad es una prioridad, por lo que todos los datos financieros deben estar encriptados. La aplicación debe desarrollarse usando Flutter tanto para plataformas iOS como Android."',
    GENERATE_LABEL: 'Generar Plano',
    COPY_LABEL: 'Copiar Texto',
    PRINT_LABEL: 'Imprimir PDF',
  },
  pt: {
    INPUT_TITLE: 'Descreva sua próxima ideia de desenvolvimento',
    INPUT_DESC:
      'Forneça descrições claras e detalhadas das funcionalidades do seu aplicativo, público-alvo, preferências de plataforma, interações do usuário e quaisquer requisitos específicos para obter o melhor resultado.',
    INPUT_PLACEHOLDER:
      'Exemplo:\n"Quero criar um aplicativo móvel para gerenciar finanças pessoais. Os usuários devem poder criar uma conta, vincular suas contas bancárias e definir orçamentos. O aplicativo deve enviar notificações de contas futuras e rastrear hábitos de gastos. A segurança é uma prioridade, portanto, todos os dados financeiros devem ser criptografados. O aplicativo deve ser desenvolvido usando Flutter para as plataformas iOS e Android."',
    GENERATE_LABEL: 'Gerar Projeto',
    COPY_LABEL: 'Copiar Texto',
    PRINT_LABEL: 'Imprimir PDF',
  },
};

export default Home;
