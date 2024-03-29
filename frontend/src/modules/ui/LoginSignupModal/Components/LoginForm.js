import {
    ContentHeader,
    ContentHeading,
    ContentBody,
    ToggleText,
    ToggleButton,
    TextDivider,
} from '../Styles/Styles';
import AuthForm from './AuthForm';
import ThirdPartyAuth from './ThirdPartyAuth';
import { GoogleIcon } from '../../../../assets/ext-icon';
import VerificationPage from './VerificationPage';
import { useRecoilValue } from 'recoil';
import { OpenedPageState } from '../states/OpenedPageState';
import Pages from '../constants/PageStates';
import PasswordReset from './PasswordReset';

export default function LoginForm({ handleToggle }) {
    const pageState = useRecoilValue(OpenedPageState);
    if (pageState === Pages.emailVerify || pageState === Pages.passwordVerify) {
        return <VerificationPage />;
    }
    if (pageState === Pages.passwordReset) {
        return <PasswordReset />;
    }

    return (
        <>
            <ContentHeader>
                <ContentHeading>Log In</ContentHeading>
                <div className="text-gray-500 text-sm">Welcome back!</div>
            </ContentHeader>
            <ContentBody>
                <ThirdPartyAuth title="Google" Icon={GoogleIcon} />
                <TextDivider>or</TextDivider>
                <AuthForm isLogin={true} />
                <ToggleText>
                    <div>Don't have an account?</div>
                    <ToggleButton onClick={handleToggle}>Sign Up</ToggleButton>
                </ToggleText>
            </ContentBody>
        </>
    );
}
