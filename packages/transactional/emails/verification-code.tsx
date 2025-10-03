import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
  Img,
  Row,
  Column,
} from "@react-email/components";

const WelcomeEmail: React.FC<{
  name: string;
}> = ({ name = "Karlo" }) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans lg:px-6 px-4">
          <Container className="border border-solid border-[#f59f0a] rounded my-10 p-4  ">
            <Section>
              <Row>
                <Column>
                  <Heading className="text-2xl">Verification code</Heading>
                </Column>
                <Column>
                  <Row>
                    <Column align="right">
                      <Text>[app name]</Text>
                    </Column>
                    <Column align="right">
                      {/* Stavi sliku 
                      <div className="rounded-full bg-black size-10" /> */}
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            <Hr className="!border-[#f59f0a]" />
            <Text className="mt-6 text-base">
              Thank you for logging in again on [app nane]. We want to make sure
              it's really you. Please enter the following verification code when
              prompted.
            </Text>

            <Section>
              <Text className="text-center text-base font-semibold">
                Your verification code is:
              </Text>
              <Text className="text-center text-3xl font-semibold text-[#91400d]">
                123456
              </Text>
              <Text className="text-center text-sm">
                (After 10 minutes the code will expire)
              </Text>
            </Section>
            <Text></Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
