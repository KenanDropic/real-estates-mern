import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import VerifyEmailWarning from "./SendEmailVerification";
import Spinner from "../components/Spinner";
import { Alert, Col, Row } from "react-bootstrap";
import { logout } from "../features/users/usersSlice";
import { deleteImg, upload } from "../features/images/imagesSlice";

const Profile = () => {
  const [isImagePosted, setIsImagePosted] = useState(false);
  const [allowProfileChanges, setAllowProfileChanges] = useState(false);
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.users);
  const { loading: imgLoading, error: imgError } = useSelector(
    (state) => state.images
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      phone: "",
      imageURL: "",
    },
  });

  const navigate = useNavigate();
  const values = getValues();

  //useEffect za dohvatanje korisnikovih oglasa i broja telefona
  useEffect(() => {
    if (user) {
      const defaults = {
        username: user?.name,
        email: user?.email,
        phone: user?.phone,
        imageURL: user?.avatar,
      };
      reset(defaults);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //useEffect koji osluškuje promjenu userPhoneNumber state i ažurira defaultne vrijednosti po tome
  // useEffect(() => {
  // let signedWithGoogle = JSON.parse(localStorage.getItem("signedWithGoogle")); //dohvatamo vrijednost iz ls-a i s tom vrijednošću ažuriramo state isSignedWithGoogle,putem dispatch type-a "IS_SIGNED_W_GOOGLE"
  // dispatch({ type: "IS_SIGNED_W_GOOGLE", payload: signedWithGoogle });
  // return () => (isPhoneMounted.current = false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onSubmit = async (data) => {
    // const values = getValues();
    // //postoji mogućnost mijenjanja podataka,stoga ako sačuvani displayName trenutnog usera ne odgovara novoj vrijednosti iz inputa,znači da je potrebno ažurirati displayName s novom vrijednošću
    // if (auth.currentUser.displayName !== values.username) {
    //   updateProfile(auth.currentUser, {
    //     displayName: values.username,
    //   });
    //   await updateDoc(docRef, {
    //     username: values.username,
    //   });
    //   dispatch({ type: "ALLOW_PROFILE_CHANGES" });
    //   toast.success("Ime uspješno ažurirano");
    // }
    // //Ako sačuvani broj telefona trenutnog usera ne odgovara novoj vrijednosti iz inputa,znači da je potrebno ažurirati broj telefona s novom vrijednošću
    // if (userPhoneNumber !== values.phone) {
    //   // dispatchListings({ type: "SET_LOADING" });
    //   try {
    //     await updateDoc(docRef, {
    //       phone: values.phone,
    //     });
    //     dispatch({ type: "ALLOW_PROFILE_CHANGES" });
    //     //dispatchujemo i ažuriramo state userPhone,dok za state userListings proslijeđujemo već dohvaćene korisnikove oglase
    //     dispatchListings({
    //       type: "SET_USER_LISTINGS_AND_PHONE",
    //       payload: { userListings: userListings, userPhone: values.phone },
    //     });
    //     toast.success("Broj telefona uspješno ažuriran");
    //   } catch (error) {
    //     dispatchListings({ type: "REMOVE_LOADING" });
    //   }
    // }
  };

  // on change what happens
  const handleFileInputChange = (e) => {
    setIsImagePosted(true);
    const file = e.target.files[0];
    // console.log("File input state", e.target.value);
    // console.log("Preview file & selected file", file);
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  // preview image
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // cancle confirmation
  const cancelProfilePhoto = () => {
    setPreviewSource("");
    setIsImagePosted(false);
  };

  // confifrm profile photo
  const confirmProfilePhoto = () => {
    if (!previewSource) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => {
      dispatch(upload(reader.result));
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
    setIsImagePosted(false);
  };

  return loading || imgLoading ? (
    <Spinner />
  ) : error ? (
    <Alert type="info" variant="info">
      {error}
    </Alert>
  ) : (
    <div className="profileContainer">
      <Row className="d-flex align-items-center mb-3">
        <Col>
          <h2>Moj profil</h2>
        </Col>
        <Col className="d-flex justify-content-end">
          <p
            className="logout"
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            Odjavi se <i className="fas fa-sign-out-alt"></i>
          </p>
        </Col>
      </Row>
      <main>
        <div className="profileInfo">
          <div
            className="profilePhotoDiv"
            style={{
              backgroundImage: `url(${user?.avatar})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {previewSource !== "" && <img src={previewSource} alt="" />}
            <div className="addPhoto">
              <input
                {...register("imageURL", {
                  onChange: handleFileInputChange,
                })}
                type="file"
                // value={fileInputState !== "" ? fileInputState : user?.avatar}
                accept=".jpg,.png,.jpeg"
                disabled={isImagePosted ? true : false}
              />
              <i
                className={
                  isImagePosted ? "fas fa-camera hidden" : "fas fa-camera"
                }
              />
              <div className="saveOrCancel">
                <i
                  className={
                    isImagePosted ? "fas fa-check visible" : "fas fa-check"
                  }
                  onClick={confirmProfilePhoto}
                />
                <i
                  className={
                    isImagePosted ? "fas fa-times visible" : "fas fa-times"
                  }
                  onClick={cancelProfilePhoto}
                ></i>
              </div>
            </div>
          </div>
          <div className="profileHeader">
            <p>Personal Details</p>
            <button
              className="change"
              onClick={() => setAllowProfileChanges(!allowProfileChanges)}
            >
              {allowProfileChanges ? "Done" : "Change"}
            </button>
          </div>
          <form className="profileForm" onSubmit={handleSubmit(onSubmit)}>
            <input
              name="username"
              {...register("username", {
                required: "Field is required",
                minLength: {
                  value: 3,
                  message: "Username must contain at least 3 characters",
                },
                maxLength: {
                  value: 18,
                  message: "Username must contain less than 18 characters",
                },
              })}
              value={user?.username}
              type="text"
              className={allowProfileChanges ? "allowChange" : ""}
              disabled={allowProfileChanges ? false : true}
            />
            <small style={{ color: "red" }}>{errors.username?.message}</small>

            <input
              name="phone"
              {...register("phone", {
                required: "Field is required",
                pattern: {
                  value:
                    /^[+][0-9]{3}[\s-.]?[6][1-5][\s-.]?[0-9]{3}[\s-.]?[0-9]{3,4}$/,
                  message:
                    "Molimo vas,unesite ispravan format telefonskog broja",
                },
              })}
              value={user?.phone}
              type="tel"
              className={allowProfileChanges ? "allowChange" : ""}
              disabled={allowProfileChanges ? false : true}
              //disabled ako je allowChange false,u suprotnom nije disabled
            />
            <small style={{ color: "red" }}>{errors.phone?.message}</small>

            <div style={{ display: "flex" }}>
              <button
                type="submit"
                style={{ marginRight: "15px" }}
                className={`btn btn-sm btn-secondary ${
                  allowProfileChanges ? "visible" : "invisible"
                }`}
                //ako je allowChange true,bit će vidljiv button,u suprotnom neće biti vidljiv
              >
                Confirm Changes
              </button>
              <button
                className={`btn btn-sm btn-secondary ${
                  allowProfileChanges ? "visible" : "invisible"
                }`}
                onClick={() => {
                  //   dispatch({ type: "ALLOW_PROFILE_CHANGES" });
                  //   const defaults = {
                  //     username: displayName,
                  //     phone: userPhoneNumber,
                  //     imageURL: auth.currentUser.photoURL,
                  //   };
                  //   reset(defaults);
                  //ako abortujemo promjenu,resetujemo na defaultne vrijednosti
                }}
              >
                Abort changes
              </button>
            </div>
          </form>
          <Link to="/create-listing" className="createListingLink">
            <i className="fas fa-home" />{" "}
            <span>Prodajte ili iznajmite vaš stan/kuću</span>
            <i className="fas fa-arrow-right" />
          </Link>
        </div>
        <p className="yourListings">Vaše objave</p>
      </main>
      <div className="yourListingsContainer">
        {/* {userListings !== null &&
        userListings !== undefined &&
        userListings.map((listing, idx) => (
          <ListingItem
            key={listing.id}
            id={listing.id}
            data={listing.data}
            onDelete={true}
            edit={true}
            index={idx}
          />
        ))} */}
      </div>
    </div>
  );
};

export default Profile;

//   ) : (
//     <VerifyEmailWarning />
//   );
