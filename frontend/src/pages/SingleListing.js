import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { getListing } from "../features/listings/listingsSlice";
import { ReactComponent as SurfaceIcon } from "../assets/svg/area-black.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";

const SingleListing = () => {
  const dispatch = useDispatch();
  const { listing, loading, error } = useSelector((state) => state.listings);
  const { listingId } = useParams();

  useEffect(() => {
    dispatch(getListing(listingId));
    //eslint-disable-next-line
  }, [dispatch, listingId]);

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert type="danger" variant="danger">
      {error}
    </Alert>
  ) : (
    listing !== null && (
      <div className="singleListingPage">
        <header>
          {listing?.images && (
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              pagination={{ clickable: true }}
              slidesPerView={2}
              scrollbar={{ draggable: true }}
              style={{ width: "100%" }}
            >
              {listing?.images.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="swiperSlideDiv"
                    style={{ backgroundImage: `url(${imgUrl})` }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </header>
        <main>
          {/* Name-Price-Type */}
          <div className="singleListing-nameAndPrice">
            <p className="title">
              <span className="singleListing-paragraph">
                {listing?.name} -{" "}
                {listing?.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                KM
              </span>
            </p>

            <p className="singleListing-type">
              {listing?.type === "rent" ? "Iznajmljivanje" : "Prodaja"}
            </p>
          </div>
          {/* Snižena cijena - ako je uopšte dodano */}
          {listing?.offer && (
            <div className="discountedPrice">
              <i className="fas fa-percentage" />
              <span>Snižena cijena - </span>
              <span>{listing.discountedPrice}KM</span>
            </div>
          )}
          {/* Adresa oglasa */}
          <p className="title" style={{ marginTop: "50px" }}>
            <span>Informacije</span>
          </p>
          <div className="singleListing-address">
            <i className="fas fa-map-marked-alt"></i>
            <span>
              {listing?.address} - {listing?.city}
            </span>
          </div>
          {/* Kuća/Stan */}
          <div className="buildingType">
            <span>
              {listing?.building === "house" ? (
                <i className="fas fa-home"></i>
              ) : (
                <i className="fas fa-building"></i>
              )}
              Tip objekta -
            </span>
            <span className="grayText">
              {listing?.building === "house" ? "Kuća" : "Stan"}
            </span>
          </div>
          {/* Površina/Broj soba */}
          <div className="roomsAndSurface">
            <div className="rooms">
              <i className="fas fa-door-open"></i>
              <span>Broj Soba</span>
              <small>{listing?.rooms}</small>
            </div>
            <div className="singleListing-surface">
              <SurfaceIcon
                width="25px"
                height="25px"
                className="surface-icon"
              />
              <span>Površina</span>
              <small>{listing?.surface}</small>
            </div>
          </div>
          {/* Kupatila/Spavaće sobe */}
          <div className="bedroomsAndBathrooms">
            <div className="bedrooms">
              <i className="fas fa-bath"></i>
              <span>Kupatila</span>
              <small>{listing?.bathrooms}</small>
            </div>
            <div className="bathrooms">
              <i className="fas fa-bed"></i>
              <span>Spavaće sobe</span>
              <small>{listing?.bedrooms}</small>
            </div>
          </div>
          {/* Ostalo; garaža,parking... */}
          <p className="title" style={{ marginTop: "50px" }}>
            <span>Ostalo</span>
          </p>
          <div className="ostalo">
            <div className="singleListing-grage">
              <small>Garaža</small>
              {listing?.garage ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-times" />
              )}
            </div>
            <div className="singleListing-parking">
              <small>Parking</small>
              {listing?.parking ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-times" />
              )}
            </div>
            <div className="singleListing-furnished">
              <small>Namješten</small>
              {listing?.furnished ? (
                <i className="fas fa-check" />
              ) : (
                <i className="fas fa-times" />
              )}
            </div>
          </div>
          {/* OPIS */}
          <p className="title" style={{ marginTop: "50px" }}>
            <span>Opis</span>
          </p>
          <div className="descriptionDiv">
            <span>{listing?.description}</span>
          </div>

          <p className="title" style={{ marginTop: "50px" }}>
            <span> Lokacija </span>
          </p>
          <div className="leafletContainer">
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={18}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <>
            <p className="title" style={{ marginTop: "15px" }}>
              <span>Informacije o vlasniku</span>
            </p>
            <div className="listingOwner">
              <span>
                Oglas kreirao: <strong>{listing?.user.name}</strong>
              </span>
              <br />
              <span>
                Telefonski kontakt:
                <strong> {listing?.user.phone}</strong>
              </span>
              <br />
              <span>
                Mail kontakt:
                <strong> {listing?.user.email}</strong>
              </span>
            </div>
          </>
        </main>
      </div>
    )
  );
};

export default SingleListing;
