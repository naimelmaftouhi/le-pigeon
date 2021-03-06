import React from "react";
import Rating from "@material-ui/lab/Rating";
import { Link } from "react-router-dom";
import AvatarDefault from "../../assets/images/avatar_default.png";

const CardAgent = ({ agent, avgRatings }) => {
  return (
    <div className="card testimonials testimonial-card">
      <div className="card-up info-color"></div>
      <div className="avatar mx-auto white">
        <Link to={"/agent/" + agent.id}>
          <img
            src={
              agent.avatar
                ? process.env.REACT_APP_BASE_URL + "/avatar/" + agent.avatar
                : AvatarDefault
            }
            className="rounded-circle img-fluid"
            alt={
              "Le Pigeon | Avatar de " + agent.firstName + " " + agent.lastName
            }
          />
        </Link>
      </div>
      <div className="card-body">
        <h4 className="font-weight-bold mb-4">
          {agent.firstName} {agent.lastName}
        </h4>
        <Rating name="rating" value={+avgRatings} readOnly />
        <hr />
        <p className="dark-grey-text mt-4">Thaïlande</p>
      </div>
    </div>
  );
};

export default CardAgent;
