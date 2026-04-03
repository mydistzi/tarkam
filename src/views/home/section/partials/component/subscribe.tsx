//import ChangeEventHandler, FormEventHandler from react
import type { ChangeEventHandler, FormEventHandler } from "react";

interface SubscribeProps {
	isSubscribe: FormEventHandler<HTMLFormElement>;
	handleSubscribe: ChangeEventHandler<HTMLInputElement>;
	valueEmail: string;
}

function Subscribe({ isSubscribe, handleSubscribe, valueEmail }: SubscribeProps) {
    return (
        <div className="distnewsletter" id="distnewsletter">
		<div className="container">
			<div className="distnewsletter-grids">
				<div className="col-md-5 distnewsletter-grid distnewsletter-grid-1 subscribe">
					<p>{`Subscribe to our Newsletter`}</p>
				</div>
				<div className="col-md-7 distnewsletter-grid distnewsletter-grid-2 email-form">
					<form onSubmit={isSubscribe}>
						<input
							className="email"
							type="email"
							name="email"
							id="email"
							placeholder="Email Address"
							autoComplete="off"
							required
							value={valueEmail}
							onChange={handleSubscribe}
						/>
						<input type="submit" className="submit" value="SUBSCRIBE" />
					</form>
				</div>
				<div className="clearfix"></div>
			</div>
		</div>
	</div>
    )
}

export default Subscribe;