import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { OpenedPageState } from '../states/OpenedPageState';
import { AuthFormState } from '../states/AuthFormState';
import { Theme } from '../../Theme/theme';
import { useAuth } from '../../../../context/Auth/useAuth';
import { useAuthModal } from '../hooks/useAuthModal';
import { backendOrigin } from '../../../../frontend.config';
import axios from 'axios';
import { IconProvider } from '../../IconProvider/IconProvider';
import { ChevronLeft } from '../../../../assets/ext-icon';
import Pages from '../constants/PageStates';
import { PasswordChangeFormState } from '../states/PasswordChangeFormState';
import { LoginDataState } from '../states/LoginDataState';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: ${Theme.spacing(6)};
`;

const StyledHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    width: 100%;
`;

const StyledBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${Theme.spacing(10)};
    width: 100%;
    color: ${Theme.color.gray60};
    text-align: center;
    font-size: ${Theme.font.size.base};
`;

const DigitInputContainer = styled.div`
    display: flex;
    gap: ${Theme.spacing(2)};
`;

const DigitInput = styled.input`
    width: ${Theme.font.lineHeight['3xl']};
    height: ${Theme.font.lineHeight['3xl']};
    font-size: ${Theme.font.size['2xl']};
    text-align: center;
    border: 1px solid ${Theme.color.gray50};
    outline: none;
    border-radius: ${Theme.border.radius.md};

    &:focus {
        border: 1px solid black;
    }
`;

const StyledButton = styled.button`
    margin-top: ${Theme.spacing(2)};
    background-color: ${(props) => (props.disabled ? 'gray' : 'black')};
    color: white;
    padding: 10px;
    border: none;
    border-radius: ${Theme.border.radius.md};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    width: 100%;
`;

export default function VerificationPage() {
    const { loginAuth } = useAuth();
    const loginDataValue = useRecoilValue(LoginDataState);
    const resetLoginDataState = useResetRecoilState(LoginDataState);
    const { closeAuthModal } = useAuthModal();
    const [pageState, setPageState] = useRecoilState(OpenedPageState);
    const [authFormState, setAuthFormState] = useRecoilState(AuthFormState);
    const [passwordFormState, setPasswordFormState] = useRecoilState(PasswordChangeFormState);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [proceedDisabled, setProceedDisabled] = useState(true);

    useEffect(() => {
        const instance = axios.create({
            withCredentials: true,
            baseURL: backendOrigin,
        });

        const fetchCodeInfo = async () => {
            try {
                if (pageState === Pages.emailVerify) {
                    await instance.get('/emailVerify', {
                        params: new URLSearchParams({
                            email: authFormState.email,
                        }),
                    });
                } else if (pageState === Pages.passwordVerify) {
                    await instance.get('/passwordVerify', {
                        params: new URLSearchParams({
                            email: passwordFormState.email,
                        }),
                    });
                }
            } catch (error) {
                console.error('Error fetching code info:', error.message);
            }
        };

        fetchCodeInfo();
    }, []);

    const handleDigitChange = (index, value) => {
        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }

        const allFieldsFilled = inputRefs.every(
            (ref) => ref.current && ref.current.value
        );
        setProceedDisabled(!allFieldsFilled);

        if (allFieldsFilled) {
            handleProceed();
        }
    };

    const handleBackspace = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && !event.target.value) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleProceed = async () => {
        const instance = axios.create({
            withCredentials: true,
            baseURL: backendOrigin,
        });
        const verificationCode = inputRefs
            .map((ref) => ref.current.value)
            .join('');
        let verifyResponse = null;
        if (pageState === Pages.emailVerify) {
            verifyResponse = await instance.post(
                '/emailVerify',
                {
                    email: authFormState.email,
                    code: verificationCode,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        else if (pageState === Pages.passwordVerify) {
            verifyResponse = await instance.post(
                '/passwordVerify',
                {
                    email: passwordFormState.email,
                    code: verificationCode,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        if (verifyResponse.status === 201) {
            let result = '';
            if (pageState === Pages.emailVerify) {
                loginAuth(loginDataValue);
                result = 'SUCCESS';
            }
            else if (pageState === Pages.passwordVerify) {
                const changePasswordResponse = await instance.patch('/users/changepassword', {
                    email: passwordFormState.email,
                    password: passwordFormState.password,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (changePasswordResponse.status === 201) {
                    result = 'SUCCESS';
                }
            }

            if (result === 'SUCCESS') {
                if (pageState === Pages.emailVerify) {
                    closeAuthModal();
                }
                resetLoginDataState();
                setPageState(Pages.main);
                setAuthFormState({
                    name: null,
                    email: null,
                    password: null,
                    type: null,
                });
                setPasswordFormState({
                    email: null,
                    password: null,
                });
            }
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <button
                    onClick={() => {
                        setPageState(Pages.main);
                    }}
                >
                    <IconProvider Icon={ChevronLeft} size={2} />
                </button>
            </StyledHeader>
            <StyledBody>
                We have sent a verification code to {pageState === Pages.emailVerify ? authFormState.email : passwordFormState.email}.
                Please verify your email to proceed.
                <DigitInputContainer>
                    {[0, 1, 2, 3].map((index) => (
                        <DigitInput
                            key={index}
                            ref={inputRefs[index]}
                            id={`digit-input-${index}`}
                            type="text"
                            maxLength="1"
                            onChange={(e) =>
                                handleDigitChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleBackspace(index, e)}
                        />
                    ))}
                </DigitInputContainer>
                <StyledButton
                    disabled={proceedDisabled}
                    onClick={handleProceed}
                >
                    Proceed
                </StyledButton>
            </StyledBody>
        </StyledContainer>
    );
}
