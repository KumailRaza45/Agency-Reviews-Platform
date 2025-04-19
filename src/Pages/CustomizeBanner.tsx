import { useEffect, useMemo, useState } from "react";
import { ReactComponent as DeskTop1 } from "../assets/images/Agencie Reviews Website/Frame 442.svg"
import { ReactComponent as DeskTop2 } from "../assets/images/Agencie Reviews Website/Frame 443.svg"
import { ReactComponent as DeskTop3 } from "../assets/images/Agencie Reviews Website/Frame 444.svg"


import { ReactComponent as Mobile1 } from "../assets/images/Agencie Reviews Website mobile/Frame 442.svg"
import { ReactComponent as Mobile2 } from "../assets/images/Agencie Reviews Website mobile//Frame 443.svg"
import { ReactComponent as Mobile3 } from "../assets/images/Agencie Reviews Website mobile//Frame 444.svg"
import { ReactComponent as CopyCode } from "../assets/Icons/copy-code.svg";
import { gql, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { option_1_dark, option_1_light, option_2_dark, option_2_light, option_3_dark, option_3_light, option_4_dark, option_4_light } from "../Utilities/widgetbar_templates";

const BannerMutation = gql`
  mutation createAgencyWidget($data: CreateAgencyWidgetInput!) {
    createAgencyWidget(data: $data) {
      id
      agency_id
      code
      widget
      is_dark_mode
      component_index
    }
  }
`

const GetWidget = gql`
  mutation getAgencyWidget($agency_id: Int!) {
    getAgencyWidget(agency_id: $agency_id) {
      id
      agency_id
      code
      widget
      is_dark_mode
      component_index
    }
  }
`

function CustomizeBanner() {

  const [bannerReq, { data: bannerRes }] = useMutation(BannerMutation);
  const [getWidgetReq, { data: GetWidgetRes }] = useMutation(GetWidget);
  const { id } = useParams()

  const [selectedOption, setSelectedOption] = useState('option1');
  const [htmlSnippet, sethtmlSnippet] = useState(`Loading...`)

  const bannerReqFenc = async (option, mode) => {
    const result = await bannerReq({
      variables: {
        data: {
          "agency_id": parseInt(`${id}`),
          "widget": (option === "option1" && mode === "option1") ? option_1_dark
            : (option === "option1" && mode === "option2") ? option_1_light
              : (option === "option2" && mode === "option1") ? option_2_dark
                : (option === "option2" && mode === "option2") ? option_2_light
                  : (option === "option3" && mode === "option1") ? option_3_dark
                    : (option === "option3" && mode === "option2") ? option_3_light
                      : (option === "option4" && mode === "option1") ? option_4_dark
                        : option_4_light,
          "is_dark_mode": mode === "option1" ? true : false,
          "component_index": option === "option1" ? 0 : option === "option2" ? 1 : option === "option3" ? 2 : 3
        },
      },
    });
    console.log(result.data.createAgencyWidget.code, "___result");

    sethtmlSnippet(`<script>
  window.onload = function () {
    async function loadWidget() {
      try {
        const res = await fetch('https://agencyreviews-api-dev.powerhouse.so/agency_widget?agency_id=${id}&code=${result.data.createAgencyWidget.code}');
        if (!res.ok) {
          throw new Error("Error");
        }
        const component = await res.json();
        let elem = document.createElement('div');
        elem.innerHTML = component.widget;
        document.body.insertBefore(elem, document.body.firstChild);
      } catch (error) {
        console.error('Failed to load widget:', error);
      }
    }
    loadWidget();
  }
</script>`)

  }

  const GetWidgetFunc = async (agency_id) => {
    const result = await getWidgetReq({
      variables: {
        agency_id: parseInt(`${agency_id}`)
      },
    });
    const { code, component_index, is_dark_mode } = result?.data?.getAgencyWidget

    sethtmlSnippet(`<script>
  window.onload = function () {
    async function loadWidget() {
      try {
        const res = await fetch('https://agencyreviews-api-dev.powerhouse.so/agency_widget?agency_id=${id}&code=${code}');
        if (!res.ok) {
          throw new Error("Error");
        }
        const component = await res.json();
        let elem = document.createElement('div');
        elem.innerHTML = component.widget;
        document.body.insertBefore(elem, document.body.firstChild);
      } catch (error) {
        console.error('Failed to load widget:', error);
      }
    }
    loadWidget();
  }
</script>`)

    setSelectedOption(is_dark_mode ? "option1" : "option2")
    setSelectedCopy(component_index === 0 ? "option1" : component_index === 1 ? "option2" : component_index === 2 ? "option3" : "option4")
    // console.log(result?.data?.getAgencyWidget, "result 123");
    // return result?.data?.getAgencyWidget
  }

  const handleOptionChange = async (event) => {
    setSelectedOption(event.target.value);
    await bannerReqFenc(selectedCopy, event.target.value)
  };

  const [selectedCopy, setSelectedCopy] = useState('option1');

  const handleCopyChange = async (selected) => {
    setSelectedCopy(selected);
    await bannerReqFenc(selected, selectedOption)
  };

  const option_1 = useMemo(() => {
    if (selectedOption === "option2") {
      return (
        <div style={{ margin: '0%', fontFamily: '"Inter"', width: '100%', background: '#fff', display: 'flex', flexWrap: 'wrap', padding: '12px 16px', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>We
            are proud to be
            a Verified Agency on</p>
          <div style={{ margin: '0%', display: 'flex', gap: '8px' }}>
            <img style={{ width: "82.5px", height: "15px" }} src="https://agencyreviews-dev.s3.amazonaws.com/logo_dark.svg" alt="logo" />
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              with an
              "IMPRESSIVE" rating</p>
          </div>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex' }}>
              <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_grey.svg" alt="Star" />
            </div>
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '12px', fontStyle: 'normal', fontWeight: 600, lineHeight: '24px' }}>
              4.9</p>
          </div>
        </div>
      )
    }
    else {
      return (
        <div
          style={{
            margin: '0%',
            fontFamily: 'Inter',
            width: '100%',
            background: '#3364f7',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '12px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <p
            style={{
              margin: '0%',
              color: '#fff',
              fontSize: '9px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '18px',
            }}
          >
            We are proud to be a Verified Agency on
          </p>
          <div style={{ margin: '0%', display: 'flex', gap: '8px' }}>
            <img style={{ width: "82.5px", height: "15px" }} src="https://agencyreviews-dev.s3.amazonaws.com/logo_light.png" alt="logo" />
            <p
              style={{
                margin: '0%',
                color: '#fff',
                fontSize: '9px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '18px',
              }}
            >
              with an "IMPRESSIVE" rating
            </p>
          </div>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img width="15px" height="15px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="15px" height="15px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="15px" height="15px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="15px" height="15px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
              <img width="15px" height="15px" src="https://agencyreviews-dev.s3.amazonaws.com/star_white.svg" alt="Star" />
            </div>
            <p
              style={{
                margin: '0%',
                color: '#fff',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '24px',
              }}
            >
              4.9
            </p>
          </div>
        </div>
      )
    }
  }, [selectedOption])

  const option_2 = useMemo(() => {
    if (selectedOption === "option2") {
      return (
        <div
          style={{
            margin: '0%',
            fontFamily: 'Inter',
            width: '100%',
            background: '#fff',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '12px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p
              style={{
                margin: '0%',
                color: '#3364f7',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '18px',
              }}
            >
              IMPRESSIVE
            </p>
            <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                {[...Array(4)].map((_, index) => (
                  <img key={index} width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                ))}
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_grey.svg" alt="Star" />
              </div>
              <p
                style={{
                  margin: '0%',
                  color: '#3364f7',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '24px',
                }}
              >
                4.9
              </p>
            </div>
            <p
              style={{
                margin: '0%',
                color: '#3364f7',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '18px',
              }}
            >
              on
            </p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_dark.svg" alt="logo" />
        </div>
      )
    }
    else {
      return (
        <div
          style={{
            fontFamily: 'Inter',
            width: '100%',
            background: '#3364f7',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '12px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '18px',
            }}>
              IMPRESSIVE
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="20px" height="20px" src="https://agencyreviews-dev.s3.amazonaws.com/star_white.svg" alt="Star" />
              </div>
              <p style={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '24px',
              }}>
                4.9
              </p>
            </div>
            <p style={{
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '18px',
            }}>
              on
            </p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_light.png" alt="logo" />
        </div>
      )
    }
  }, [selectedOption])

  const option_3 = useMemo(() => {
    if (selectedOption === "option2") {
      return (
        <div style={{ margin: '0%', fontFamily: '"Inter"', width: '100%', background: '#fff', display: 'flex', flexWrap: 'wrap', padding: '12px 16px', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              Check out our
            </p>
            <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_grey.svg" alt="Star" />
              </div>
              <p style={{ margin: '0%', color: '#3364f7', fontSize: '12px', fontStyle: 'normal', fontWeight: 600, lineHeight: '24px' }}>
                4.9</p>
            </div>
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              reviews on
            </p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_dark.svg" alt="logo" />
        </div>
      )
    }
    else {
      return (
        <div style={{ margin: '0%', fontFamily: '"Inter"', width: '100%', background: '#3364f7', display: 'flex', flexWrap: 'wrap', padding: '12px 16px', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: '0%', color: '#fff', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              Check out our
            </p>
            <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_white.svg" alt="Star" />
              </div>
              <p style={{ margin: '0%', color: '#fff', fontSize: '12px', fontStyle: 'normal', fontWeight: 600, lineHeight: '24px' }}>
                4.9</p>
            </div>
            <p style={{ margin: '0%', color: '#fff', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              reviews on</p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_light.png" alt="logo" />
        </div>
      )
    }
  }, [selectedOption])

  const option_4 = useMemo(() => {
    if (selectedOption === "option2") {
      return (
        <div style={{ margin: '0%', fontFamily: '"Inter"', width: '100%', background: '#fff', display: 'flex', flexWrap: 'wrap', padding: '12px 16px', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              Verified
              Agency with</p>
            <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_grey.svg" alt="Star" />
              </div>
              <p style={{ margin: '0%', color: '#3364f7', fontSize: '12px', fontStyle: 'normal', fontWeight: 600, lineHeight: '24px' }}>
                4.9</p>
            </div>
            <p style={{ margin: '0%', color: '#3364f7', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              on</p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_dark.svg" alt="logo" />
        </div>
      )
    }
    else {
      return (
        <div style={{ margin: '0%', fontFamily: '"Inter"', width: '100%', background: '#3364f7', display: 'flex', flexWrap: 'wrap', padding: '12px 16px', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: '0%', color: '#fff', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              Verified Agency
              with</p>
            <div style={{ margin: '0%', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_fill.svg" alt="Star" />
                <img width="12px" height="12px" src="https://agencyreviews-dev.s3.amazonaws.com/star_white.svg" alt="Star" />
              </div>
              <p style={{ margin: '0%', color: '#fff', fontSize: '12px', fontStyle: 'normal', fontWeight: 600, lineHeight: '24px' }}>
                4.9</p>
            </div>
            <p style={{ margin: '0%', color: '#fff', fontSize: '9px', fontStyle: 'normal', fontWeight: 600, lineHeight: '18px' }}>
              on</p>
          </div>
          <img src="https://agencyreviews-dev.s3.amazonaws.com/logo_light.png" alt="logo" />
        </div>
      )
    }
  }, [selectedOption])

  useEffect(() => {
    GetWidgetFunc(id)
  }, [])


  return (
    <div>
      <h4 className="text-[24px] font-montserrat font-semibold mb-5 min-w-[400px] col-span-12 flex justify-start">
        Customize Banner
      </h4>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div style={{ width: "50%", padding: '20px', position: "relative" }}>
          <div style={{ width: "100%", maxWidth: "532px" }}>
            {
              selectedCopy === "option1"
                ?
                option_1
                :
                selectedCopy === "option2"
                  ?
                  option_2
                  :
                  selectedCopy === "option3"
                    ?
                    option_3
                    :
                    option_4
            }
            <DeskTop1 style={{ width: "100%" }} />
            <DeskTop2 style={{ width: "100%" }} />
            <DeskTop3 style={{ width: "100%" }} />
          </div>

          <div style={{ width: "100%", maxWidth: "243px", position: "absolute", top: "130px", left: "50px" }}>
            {
              selectedCopy === "option1"
                ?
                option_1
                :
                selectedCopy === "option2"
                  ?
                  option_2
                  :
                  selectedCopy === "option3"
                    ?
                    option_3
                    :
                    option_4
            }
            <Mobile1 style={{ width: "100%" }} />
            <Mobile2 style={{ width: "100%" }} />
            <Mobile3 style={{ width: "100%" }} />
          </div>

        </div>
        <div style={{ width: "50%", borderLeft: "1px solid #D0D5DD" }} className="left-side-customize-banner">
          <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="text-[14px] font-[600]" style={{ marginBottom: '10px' }}>Choose your design</h2>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option1"
                  checked={selectedOption === 'option1'}
                  onChange={handleOptionChange}
                />
                Dark Mode
              </label>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option2"
                  checked={selectedOption === 'option2'}
                  onChange={handleOptionChange}
                />
                Light Mode
              </label>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h2 className="text-[14px] font-[600]" style={{ marginBottom: '10px' }}>Choose your copy</h2>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option1"
                  checked={selectedCopy === 'option1'}
                  onChange={() => handleCopyChange('option1')}
                />
                We are proud to be a Verified Agency on Agencyreviews with an "IMPRESSIVE" rating
              </label>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option2"
                  checked={selectedCopy === 'option2'}
                  onChange={() => handleCopyChange('option2')}
                />
                Rated: IMPRESSIVE (Start Rating) on Agencyreviews
              </label>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option3"
                  checked={selectedCopy === 'option3'}
                  onChange={() => handleCopyChange('option3')}
                />
                Check out our (Start Rating) reviews on Agencyreviews
              </label>
              <label style={{ display: 'flex', marginBottom: '5px', alignItems: "center", gap: "10px" }}>
                <input
                  style={{ width: "18px", height: "18px" }}
                  type="checkbox"
                  value="option4"
                  checked={selectedCopy === 'option4'}
                  onChange={() => handleCopyChange('option4')}
                />
                Verified Agency with (Start Rating) on Agencyreviews
              </label>
            </div>

            <div style={{ marginBottom: '20px', borderTop: '1px solid #e1e1e1', paddingTop: '24px' }}>
              <h2 className="text-[14px] font-[600]" style={{ marginBottom: '10px' }}>Paste this code on your site</h2>
              <div style={{ position: 'relative' }}>
                <textarea className="custom-scroll-bar" readOnly value={htmlSnippet} style={{ width: '100%', marginBottom: '10px', fontSize: "12px", outline: "none", overflowY: "scroll" }} />
                <div
                  style={{ position: 'absolute', right: '8px', bottom: '30px', cursor: 'pointer' }}
                  onClick={(e) => {
                    navigator.clipboard.writeText(htmlSnippet);
                  }}
                >
                  <CopyCode width={24} height={24} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 className="text-[14px] font-[600]" style={{ marginBottom: '10px' }}>How to input this code</h2>
              <p>➙ Add this code in head tag of your website</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeBanner
